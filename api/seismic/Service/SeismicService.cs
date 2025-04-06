using MySql.Data.MySqlClient;
using seismic.Models;

namespace seismic.Service
{
    public class SeismicService(IConfiguration configuration)
    {
        private readonly string? _connectionString = configuration.GetConnectionString("DefaultConnection");

        public List<SensorData> GetData()
        {
            var sensorDataList = new List<SensorData>();

            using var connection = new MySqlConnection(_connectionString);
            connection.Open();
            var command = new MySqlCommand("SELECT * FROM sensor_data", connection);
            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                var sensorData = new SensorData
                {
                    Id = reader.GetGuid("uuid"),
                    Sensor = new Sensor { Id = reader.GetString("sensor") },
                    Latitude = reader.GetString("latitude"),
                    Longitude = reader.GetString("longitude"),
                    Depth = reader.GetDouble("depth"),
                    Energy = reader.GetDouble("energy")
                };
                sensorDataList.Add(sensorData);
            }

            return sensorDataList;
        }
    }
}