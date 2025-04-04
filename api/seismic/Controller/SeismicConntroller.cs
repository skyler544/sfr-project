
using Microsoft.AspNetCore.Mvc;
using seismic.Models;

namespace seismic.Controllers;

[ApiController]
[Route("[controller]")]
public class Seismic : ControllerBase
{
    [HttpGet]
    public ActionResult<List<SeismicData>> Get()
    {
        var seismicData = new List<SeismicData>
        {
            new SeismicData { Id = 1, Continent = "Asia", Latitude = 34.0, Longitude = 100.0, Depth = 10.0, Energy = 5.0 },
            new SeismicData { Id = 2, Continent = "Europe", Latitude = 50.0, Longitude = 10.0, Depth = 20.0, Energy = 6.0 },
            new SeismicData { Id = 3, Continent = "North America", Latitude = 40.0, Longitude = -100.0, Depth = 30.0, Energy = 7.0 }
        };
        return Ok(seismicData);
    }
}