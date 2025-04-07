# GitOps Config

This is how we configured ArgoCD and Gitea for use with our backend API.

1. Create a cluster with `kind`:  
```bash
kind create cluster
```

2. Build and load the backend API image into the `kind` cluster:  
```bash
cd api/seismic/
docker build -t seismic-api:dev .
kind load docker-image seismic-api:dev
```

3. Install ArgoCD:  
```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
kubectl create namespace argocd
helm install argocd argo/argo-cd --namespace argocd
```

4. Setup ArgoCD UI:  
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d # copy the result of this command to the clipboard
kubectl port-forward service/argocd-server -n argocd 8080:443 # this will block the terminal, so you'll need a new one for further steps
```
Navigate in the browser to `localhost:8080` and accept the certificate. Login with `admin` and the password you copied before.

5. Install Gitea:  
```bash
helm repo add gitea-charts https://dl.gitea.com/charts/
helm repo update
kubectl create namespace gitea
helm install gitea gitea-charts/gitea --namespace gitea
```

6. Setup Gitea UI:  
Wait until the pod is up; you can check the status with this command:  
```bash
kubectl get pods -n gitea
```
Once the pod is running, start the UI:  
```bash
kubectl --namespace gitea port-forward svc/gitea-http 3000:3000 # this will block the terminal, so you'll need a new one for further steps
```

7. Register for a Gitea account:  
Navigate to `localhost:3000` and click `register`. Create a user with an easy-to-remember password so that pushing to the repository is easier.

8. Create a repository on Gitea  

9. Create a local file for the k8s deployment and commit it:  
In `k8s/api.yaml`:  
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: seismic-api
  labels:
    app: seismic-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: seismic-api
  template:
    metadata:
      labels:
        app: seismic-api
    spec:
      containers:
        - name: seismic-api
          image: seismic-api:dev
          ports:
            - containerPort: 80
            - containerPort: 443
          env:
            - name: ASPNETCORE_ENVIRONMENT
              value: "Production"
            - name: ASPNETCORE_URLS
              value: "http://+:80"
```

10. Push the repository to Gitea  

11. Associate the Gitea Repo with ArgoCD:  
You will need the ArgoCD password from before:
```bash
argocd login localhost:8080 --username admin --password <password>
argocd repo add http://gitea-http.gitea.svc.cluster.local:3000/gitea/sfr-project.git --username gitea --password giteagitea --insecure-ignore-host-key
```
Check that it worked on `localhost:8080 -> settings -> repositories`.

12. Create an app on ArgoCD for the Gitea repo:  
In `app.yaml`:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: sfr-project
  namespace: argocd
spec:
  project: default
  source:
    repoURL: http://gitea-http.gitea.svc.cluster.local:3000/gitea/sfr-project.git
    targetRevision: HEAD
    path: k8s  # 👈 points to the folder where manifests live
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```
This points ArgoCD to the `k8s/` folder so that it knows where the IaC files live and sets up automatic syncing so that future changes to the infrastructure are automatically picked up and applied.

13. Activate the app on ArgoCD:  
Create an app in the UI, select "EDIT AS YAML" and copy in the `app.yaml` from before. Click SAVE, then CREATE.

14. Observe the deployment on ArgoCD:  
The dashboard should populate with information about the deployment. You can make a change to the `k8s/api.yaml` and push a commit to Gitea; within a minute or two the change should be visible in ArgoCD.
