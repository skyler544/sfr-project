namespace seismic.Models;

public record SeismicData
{
    public int Id { get; set; }
    public string? Continent { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double Depth { get; set; }
    public double Energy { get; set; }
}