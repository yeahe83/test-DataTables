using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using Newtonsoft.Json;

namespace test_DataTables.server
{
    public class Item
    {
        public int ID;
        public string Name;
        public string Sex;
        public string Memo;
        public bool IsValid;
    }

    /// <summary>
    /// simple 的摘要说明
    /// </summary>
    public class simple : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            var Func = context.Request.Params["Func"];
            switch (Func)
            {
                case "show": show(context); break;
                case "add": add(context); break;
                case "edit": edit(context); break;
                case "delete": delete(context); break;
            }
        }

        private void show(HttpContext context)
        {
            List<Item> items = helper.ReadJsonFile<Item>("simple.json");
            var dataObj = new { data = items };
            string strSerializeJSON = JsonConvert.SerializeObject(dataObj);
            context.Response.Write(strSerializeJSON);
            context.Response.End();
        }

        private void add(HttpContext context)
        {
            // 传入的数据
            string data = context.Request.Params["data"];
            Item item = JsonConvert.DeserializeObject<Item>(data);

            // 自增量
            int current_id = 0;
            if(ConfigurationManager.AppSettings["simple_id"] != null)
                current_id = int.Parse(ConfigurationManager.AppSettings["simple_id"].ToString());
            int new_id = ++current_id;
            item.ID = new_id;
            helper.AddUpdateAppSettings("simple_id", new_id.ToString());

            // 新增
            List <Item> items = helper.ReadJsonFile<Item>("simple.json");
            items.Add(item);

            // 保存到json文件
            helper.writeJSONFile<Item>("simple.json", items);

            // 重新查询并返回
            item = helper.ReadJsonFile<Item>("simple.json").Where(t => t.ID == new_id).FirstOrDefault();
            var dataObj = new { result = true, item_data = item, message = "" };

            string strSerializeJSON = JsonConvert.SerializeObject(dataObj);
            context.Response.Write(strSerializeJSON);
            context.Response.End();
        }

        private void edit(HttpContext context)
        {
            // 传入的数据
            string data = context.Request.Params["data"];
            Item item = JsonConvert.DeserializeObject<Item>(data);

            // 编辑
            List<Item> items = helper.ReadJsonFile<Item>("simple.json");
            Item item_ = items.Where(t => t.ID == item.ID).FirstOrDefault();
            item_.Name = item.Name;
            item_.Sex = item.Sex;
            item_.Memo = item.Memo;
            item_.IsValid = item.IsValid;

            // 保存到json文件
            helper.writeJSONFile<Item>("simple.json", items);

            // 重新查询并返回
            item = helper.ReadJsonFile<Item>("simple.json").Where(t => t.ID == item.ID).FirstOrDefault();
            var dataObj = new { result = true, item_data = item, message = "" };

            string strSerializeJSON = JsonConvert.SerializeObject(dataObj);
            context.Response.Write(strSerializeJSON);
            context.Response.End();
        }

        private void delete(HttpContext context)
        {
            // 传入的数据
            string data = context.Request.Params["data"];
            List<string> ids = JsonConvert.DeserializeObject<List<string>>(data);

            // 编辑
            List<Item> items = helper.ReadJsonFile<Item>("simple.json");
            items.RemoveAll(t => ids.Contains(t.ID.ToString()));

            // 保存到json文件
            helper.writeJSONFile<Item>("simple.json", items);

            var dataObj = new { result = true, message = "" };
            string strSerializeJSON = JsonConvert.SerializeObject(dataObj);
            context.Response.Write(strSerializeJSON);
            context.Response.End();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}