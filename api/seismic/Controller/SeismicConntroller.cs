using Microsoft.AspNetCore.Mvc;
using seismic.Models;
using seismic.Service;

namespace seismic.Controller;

[ApiController]
[Route("[controller]")]
public class Seismic(SeismicService seismicService) : ControllerBase
{
    [HttpGet]
    public ActionResult<List<SensorData>> Get()
    {
        var seismicData = seismicService.GetData();
        return Ok(seismicData);
    }
}