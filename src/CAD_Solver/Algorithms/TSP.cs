using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAD_Solver.Algorithms
{
    public class TSP_Table : List<List<double>>
    {
        public void Copy(TSP_Table table)
        {
            this.Clear();
            foreach(var tlist in table)
            {
                var list = new List<double>();
                foreach(double el in tlist)
                {
                    list.Add(el);
                }
                this.Add(list);
            }
        }

        public Graph ToGraph()
        {
            Graph temp = new Graph();
            Random r = new Random();

            for (int i = 0; i < this.Count; i++)
            {
                temp.nodes.Add(new Node_Item() { id = "n"+i, label = "A" + (i + 1).ToString(), size = 0.5f, x = r.NextDouble(), y = r.NextDouble() });
            }

            for(int i=0; i<temp.nodes.Count; i++)
            {
                for(int j=0; j<temp.nodes.Count; j++)
                {
                    if(j != i)
                    {
                        temp.edges.Add(new Edge_Item() { id = "e" + i + j, color = "#FF0000",
                            label = this[i][j].ToString(), source = temp.nodes[i].id,
                            type = "arrow", target = temp.nodes[j].id , size = 0.5f});
                    }
                }
            }

            return temp;
        }
    }


    public class TSP_Exception : Exception
    {
        public TSP_Exception() { }
        public TSP_Exception(string message) : base(message) { }
    }

    public class TSP
    {
        public const double M = -1.0, NONE = -2.0;

        private int pointsNumber = 0;
        private List<int> path, rows, cols;
        private double pathLen = 0.0;
        private Graph graph;

        public List<int> Path
        {
            get
            {
                return path;
            }
        }
        public double PathLength
        {
            get
            {
                return pathLen;
            }
        }

        public TSP()
        {
            path = new List<int>();
            cols = new List<int>();
            rows = new List<int>();
        }

        private void reduce_row_vals(ref TSP_Table table, int index)
        {
            double min_val = NONE;

            for (int j = 0; j < pointsNumber; j++)
            {
                if (table[index][j] != M)
                {
                    if (min_val == NONE || table[index][j] < min_val)
                    {
                        min_val = table[index][j];
                    }
                }
            }

            for (int j = 0; j < pointsNumber; j++)
            {
                if (table[index][j] != M)
                {
                    table[index][j] -= min_val;
                }
            }
        }

        private void reduce_col_vals(ref TSP_Table table, int index)
        {
            double min_val = NONE;
            for (int i = 0; i < pointsNumber; i++)
            {
                if (table[i][index] != M)
                {
                    if (min_val == NONE || table[i][index] < min_val)
                        min_val = table[i][index];
                }
            }

            for (int i = 0; i < pointsNumber; i++)
            {
                if (table[i][index] != M)
                {
                    table[i][index] -= min_val;
                }
            }
        }

        private TSP_Table reduce_table_vals(ref TSP_Table table)
        {
            TSP_Table result = new TSP_Table();
            result.Copy(table);

            for (int i = 0; i < pointsNumber; i++)
            {
                reduce_row_vals(ref result, i);
            }

            for (int i = 0; i < pointsNumber; i++)
            {
                reduce_col_vals(ref result, i);
            }

            return result;
        }

        private double getPointRating(ref TSP_Table table, int r, int c)
        {
            double col_min = NONE, row_min = NONE;

            for (int i = 0; i < pointsNumber; i++)
            {
                if (i != r && table[i][c] != M)
                {
                    if (col_min == NONE || table[i][c] < col_min)
                    {
                        col_min = table[i][c];
                    }
                }

                if (i != c && table[r][i] != M)
                {
                    if (row_min == NONE || table[r][i] < row_min)
                    {
                        row_min = table[r][i];
                    }
                }
            }

            if (row_min == NONE) row_min = 0;
            if (col_min == NONE) col_min = 0;

            return (row_min + col_min);
        }

        private Tuple<int, int> getTopRatedPoint( ref TSP_Table table)
        {
            double max_rating = 0.0;
            int r_i = Convert.ToInt32(NONE), r_j = Convert.ToInt32(NONE);

            for (int i = 0; i < pointsNumber; i++)
                for (int j = 0; j < pointsNumber; j++)
                {
                    if (table[i][j] == 0)
                    {
                        double curr_rating = getPointRating(ref table, i, j);
                        if (curr_rating > max_rating)
                        {
                            max_rating = curr_rating;
                            r_i = i;
                            r_j = j;
                        }
                        else if (curr_rating == max_rating && path.Any())
                        {
                            if (rows[i] == path.Last())
                            {
                                max_rating = curr_rating;
                                r_i = i;
                                r_j = j;
                            }
                        }


                        if (r_i == Convert.ToInt32(NONE))
                        {
                            r_i = i;
                            r_j = j;
                        }
                    }
                }

            return Tuple.Create(r_i, r_j);
        }

        public void calculatePath(TSP_Table table)
        {
            pointsNumber = table.Count;
            path.Clear();
            pathLen = 0.0;

            rows.Clear();
            cols.Clear();
            for (int i = 0; i < pointsNumber; i++)
            {
                rows.Add(i);
                cols.Add(i);
            }

            TSP_Table work_table = reduce_table_vals(ref table);
            while (pointsNumber > 1)
            {
                Tuple<int, int> coords = getTopRatedPoint(ref work_table);
                int i = coords.Item1, j = coords.Item2;
            
                if (i == Convert.ToInt32(NONE) || j == Convert.ToInt32(NONE))
                    throw new TSP_Exception("No path.");
                add_to_path(ref table, i, j);
                work_table[j][i] = M;
                reduce_table(ref work_table, i, j); //pointsNumber--; here

                if (pointsNumber > 1)
                    work_table = reduce_table_vals(ref work_table);
            }

            add_to_path(ref table, 0, 0);
        }

        void add_to_path(ref TSP_Table table, int i, int j)
        {
            int abs_i = rows[i];
            int abs_j = cols[j];

            //la first point costille
            if (!path.Any())
            {
                path.Add(abs_i);
            }
            path.Add(abs_j);

            pathLen += table[abs_i][abs_j];
        }

        void reduce_table(ref TSP_Table table, int i, int j)
        {
            table.RemoveAt(i);
            for (int t = 0; t < table.Count; t++)
            {
                table[t].RemoveAt(j);
            }

            rows.RemoveAt(i);
            cols.RemoveAt(j);

            pointsNumber--;
        } 


        
             
    }
}
