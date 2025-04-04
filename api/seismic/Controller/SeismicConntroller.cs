using Microsoft.AspNetCore.Mvc;
using seismic.Models;
using seismic.Service;

namespace seismic.Controller;

[ApiController]
[Route("[controller]")]
public class Seismic : ControllerBase
{
    [HttpGet]
    public ActionResult<List<SensorData>> Get()
    {
        var seismicData = SeismicService.GetData();
        return Ok(seismicData);
    }
}