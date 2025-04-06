using seismic.Service;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<SeismicService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();