namespace seismic.Models;

public record SensorData
{
    public required Guid Id { get; set; }
    public required Sensor Sensor { get; set; }
    public string? Latitude { get; set; }
    public string? Longitude { get; set; }
    public double Depth { get; set; }
    public  double Energy { get; set; }
}