using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAD_Solver.Algorithms
{
    public class Graph
    {
        public List<Node_Item> nodes { get; set; }
        public List<Edge_Item> edges { get; set; }

        public Graph()
        {
            nodes = new List<Node_Item>();
            edges = new List<Edge_Item>();
        }
    }

    public class Node_Item
    {
        public string id { get; set; }
        public string label { get; set; }
        public float size { get; set; }
        public double x { get; set; }
        public double y { get; set; }
    }

    public class Edge_Item
    {
        public string id { get; set; }
        public string source { get; set; }
        public string target { get; set; }
        public string label { get; set; }
        public string type { get; set; }
        public string color { get; set; }
        public float size { get; set; }
    }
}
