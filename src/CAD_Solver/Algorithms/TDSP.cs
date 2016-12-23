using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAD_Solver.Algorithms
{
    public class Block
    {

        public float width { get; set; }
        public float height { get; set; }
        public float x { get; set; }
        public float y { get; set; }
        public string fill { get; set; }
        public string stroke { get; set; }
        public float strokeWidth { get; set; }
    }

    public class Level
    {
        public List<Block> floor, ceiling;
        public float Height, width, Y;
        private float currFloorX, currCeilingX;

        public Level(float stripeWidth, float levelHeight = 0)
        {
            floor = new List<Block>();
            ceiling = new List<Block>();
            Height = 0;
            Y = levelHeight;
            width = stripeWidth;
            currFloorX = 0;
            currCeilingX = width;

        }

        public bool floorFeasible(Block bl)
        {
            if (currFloorX + bl.width > width)
                return false;

            float blRightX = currFloorX + bl.width;

            foreach (var b in ceiling)
            {
                if (blRightX > b.x && bl.height > Height - b.height)
                {
                    return false;
                }
            }
            return true;
        }

        public bool ceilingFeasible(Block bl)
        {
            float blLeftX = currCeilingX - bl.width;
            float blBotY = Height - bl.height;

            if (blLeftX < floor[0].width)
                return false;

            foreach (Block b in floor)
            {
                float bRightX = b.x + b.width;
                if (blLeftX < bRightX && blBotY < b.height)
                {
                    return false;
                }
            }

            return true;
        }

        public void AddToFloor(Block bl)
        {
            floor.Add(bl);
            bl.x = currFloorX;
            currFloorX += bl.width;
            bl.y = Y;

            if(bl.height > Height)
            {
                Height = bl.height;
            }
        }

        public void AddToCeiling(Block bl)
        {
            ceiling.Add(bl);
            bl.x = currCeilingX - bl.width;
            currCeilingX -= bl.width;
            bl.y =Y + Height;
        }
    }

    public class FCNR
    {
        private List<Level> levels;
        List<Block> temp;
        private float width, height;
        public float Height { get { return height; } }

        public List<Block> LevelsToBlocklist()
        {
            List<Block> res = new List<Block>();
            foreach(var lvl in levels)
            {
                foreach (var bl in lvl.floor)
                    bl.y += bl.height;
                res.AddRange(lvl.floor);
                res.AddRange(lvl.ceiling);
            }

            foreach(var bl in res)
            {
                bl.y = Height - bl.y;
            }

            return res;
        }

        public void Pack(float width, List<Block> blockList)
        {
            this.width = width;

            if (!blockList.Any() || width <= 0)
                return;

            height = 0f;
            temp = new List<Block>();
            foreach (var bl in blockList)
            {
                temp.Add(bl);
            }
            temp.Sort(delegate (Block b1, Block b2)
            {
                return -(b1.height.CompareTo(b2.height));
            });

            initLevels();

            while (temp.Any())
            {
                packBlock(temp.First());
            }

            height = levels.Last().Y + levels.Last().Height;
        }

        private void initLevels()
        {
            levels = new List<Level>();
            levels.Add(new Level(width));
            while (levels[0].floorFeasible(temp[0]))
            {
                levels[0].AddToFloor(temp[0]);
                temp.RemoveAt(0);
                if (!temp.Any()) break;
            }
        }

        private void packBlock(Block bl)
        {
            if(bl.width > width || bl.width<=0 || bl.height <= 0)
            {
                temp.Remove(bl);
                return;
            }
            bool packed = false;
            for(int i=0; i<levels.Count; i++)
            {
                if(levels[i].ceilingFeasible(bl))
                {
                    levels[i].AddToCeiling(bl);
                    packed = true;
                    break;
                }else if(levels[i].floorFeasible(bl))
                {
                    levels[i].AddToFloor(bl);
                    packed = true;
                    break;
                }
            }
            if(!packed)
            {
                levels.Add(new Level(width, levels.Last().Y + levels.Last().Height));
                levels.Last().AddToFloor(bl);
            }

            temp.Remove(bl);
        }
    }
}