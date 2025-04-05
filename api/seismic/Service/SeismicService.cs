using seismic.Models;

namespace seismic.Service;

public class SeismicService
{
    public static List<SensorData> GetData()
    {
        return
        [
            new SensorData
            {
                Id = Guid.NewGuid(),
                Sensor = new Sensor { Id = Guid.NewGuid() },
                Latitude = "37.7749",
                Longitude = "-122.4194",
                Depth = 8.2,
                Energy = 4.5
            },

            new SensorData
            {
                Id = Guid.NewGuid(),
                Sensor = new Sensor { Id = Guid.NewGuid() },
                Latitude = "34.0522",
                Longitude = "-118.2437",
                Depth = 12.7,
                Energy = 3.2
            },

            new SensorData
            {
                Id = Guid.NewGuid(),
                Sensor = new Sensor { Id = Guid.NewGuid() },
                Latitude = "40.7128",
                Longitude = "-74.0060",
                Depth = 5.4,
                Energy = 2.8
            },

            new SensorData
            {
                Id = Guid.NewGuid(),
                Sensor = new Sensor { Id = Guid.NewGuid() },
                Latitude = "35.6762",
                Longitude = "139.6503",
                Depth = 15.3,
                Energy = 5.9
            },

            new SensorData
            {
                Id = Guid.NewGuid(),
                Sensor = new Sensor { Id = Guid.NewGuid() },
                Latitude = "-33.8688",
                Longitude = "151.2093",
                Depth = 9.7,
                Energy = 3.6
            }
        ];
    }
}