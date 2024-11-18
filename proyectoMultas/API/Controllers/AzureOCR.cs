using Azure;
using Azure.AI.Vision.ImageAnalysis;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace API.Controllers
{
    public class AzureOCR
    {
        private readonly string _endpoint;
        private readonly string _key;

        public AzureOCR()
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            _endpoint = configuration["AzureOCR:Endpoint"];
            _key = configuration["AzureOCR:Key"];
        }

        public void AnalyzeImage()
        {
            ImageAnalysisClient client = new ImageAnalysisClient(new Uri(_endpoint), new AzureKeyCredential(_key));

            ImageAnalysisResult result = client.Analyze(
                new Uri("https://www.example.com/images/image.jpg"),
                VisualFeatures.Caption | VisualFeatures.Read,
                new ImageAnalysisOptions()
                {
                    Language = "es",
                    GenderNeutralCaption = true
                });

            Console.WriteLine("Image analysis results:");
            Console.WriteLine(" Caption:");
            Console.WriteLine($"   '{result.Caption.Text}', Confidence {result.Caption.Confidence:F4}");

            Console.WriteLine(" Read:");
            foreach (DetectedTextBlock block in result.Read.Blocks)
                foreach (DetectedTextLine line in block.Lines)
                {
                    Console.WriteLine($"   Line: '{line.Text}', Bounding Polygon: [{string.Join(" ", line.BoundingPolygon)}]");
                    foreach (DetectedTextWord word in line.Words)
                    {
                        Console.WriteLine($"     Word: '{word.Text}', Confidence {word.Confidence.ToString("#.####")}, Bounding Polygon: [{string.Join(" ", word.BoundingPolygon)}]");
                    }
                }
        }
    }
}
