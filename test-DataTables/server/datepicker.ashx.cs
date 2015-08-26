using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using Newtonsoft.Json;

namespace test_DataTables.server
{
    public class Item_DatePicker
    {
        public int ID;
        public string Name;
        public string Sex;
        public string Memo;
        public DateTime? Birth;
        public int? Age;
        public DateTime? DateStart;
        public DateTime? DateEnd;
        public bool IsValid;
    }

    /// <summary>
    /// datepicker 的摘要说明
    /// </summary>
    public class datepicker : IHttpHandler
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
            List<Item_DatePicker> items = helper.ReadJsonFile<Item_DatePicker>("datepicker.json");
            var dataObj = new { data = items };
            string strSerializeJSON = JsonConvert.SerializeObject(dataObj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-dd" });
            context.Response.Write(strSerializeJSON);
            context.Response.End();
        }

        private void add(HttpContext context)
        {
            // 传入的数据
            string data = context.Request.Params["data"];
            Item_DatePicker item = JsonConvert.DeserializeObject<Item_DatePicker>(data);

            // 自增量
            int current_id = 0;
            if (ConfigurationManager.AppSettings["datepicker_id"] != null)
                current_id = int.Parse(ConfigurationManager.AppSettings["datepicker_id"].ToString());
            int new_id = ++current_id;
            item.ID = new_id;
            helper.AddUpdateAppSettings("datepicker_id", new_id.ToString());

            // 新增
            List<Item_DatePicker> items = helper.ReadJsonFile<Item_DatePicker>("datepicker.json");
            items.Add(item);

            // 保存到json文件
            helper.writeJSONFile<Item_DatePicker>("datepicker.json", items);

            // 重新查询并返回
            item = helper.ReadJsonFile<Item_DatePicker>("datepicker.json").Where(t => t.ID == new_id).FirstOrDefault();
            var dataObj = new { result = true, item_data = item, message = "" };

            string strSerializeJSON = JsonConvert.SerializeObject(dataObj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-dd" });
            context.Response.Write(strSerializeJSON);
            context.Response.End();
        }

        private void edit(HttpContext context)
        {
            // 传入的数据
            string data = context.Request.Params["data"];
            Item_DatePicker item = JsonConvert.DeserializeObject<Item_DatePicker>(data);

            // 编辑
            List<Item_DatePicker> items = helper.ReadJsonFile<Item_DatePicker>("datepicker.json");
            Item_DatePicker item_ = items.Where(t => t.ID == item.ID).FirstOrDefault();
            item_.Name = item.Name;
            item_.Sex = item.Sex;
            item_.Memo = item.Memo;
            item_.Birth = item.Birth;
            item_.Age = item.Age;
            item_.DateStart = item.DateStart;
            item_.DateEnd = item.DateEnd;
            item_.IsValid = item.IsValid;

            // 保存到json文件
            helper.writeJSONFile<Item_DatePicker>("datepicker.json", items);

            // 重新查询并返回
            item = helper.ReadJsonFile<Item_DatePicker>("datepicker.json").Where(t => t.ID == item.ID).FirstOrDefault();
            var dataObj = new { result = true, item_data = item, message = "" };

            string strSerializeJSON = JsonConvert.SerializeObject(dataObj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-dd" });
            context.Response.Write(strSerializeJSON);
            context.Response.End();
        }

        private void delete(HttpContext context)
        {
            // 传入的数据
            string data = context.Request.Params["data"];
            List<string> ids = JsonConvert.DeserializeObject<List<string>>(data);

            // 编辑
            List<Item_DatePicker> items = helper.ReadJsonFile<Item_DatePicker>("datepicker.json");
            items.RemoveAll(t => ids.Contains(t.ID.ToString()));

            // 保存到json文件
            helper.writeJSONFile<Item_DatePicker>("datepicker.json", items);

            var dataObj = new { result = true, message = "" };
            string strSerializeJSON = JsonConvert.SerializeObject(dataObj, Formatting.Indented, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-dd" });
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