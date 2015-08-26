using System;
using System.Collections.Generic;
using System.Web;
using System.IO;
using Newtonsoft.Json;
using System.Configuration;
using System.Web.Configuration;


namespace test_DataTables
{
    public class helper
    {
        // 读取JSON文件
        public static List<T> ReadJsonFile<T>(string filename)
        {
            string fullname = HttpContext.Current.Server.MapPath("~/App_Data/" + filename);
            if (File.Exists(fullname))
            {
                string json = File.ReadAllText(fullname);
                List<T> items = JsonConvert.DeserializeObject<List<T>>(json);
                if (items == null)
                    items = new List<T>();
                return items;
            }
            else
            {
                return new List<T>();
            }
        }

        // 写入JSON文件
        public static void writeJSONFile<T>(string filename, List<T> items)
        {
            string json = JsonConvert.SerializeObject(items);
            File.WriteAllText(HttpContext.Current.Server.MapPath("~/App_Data/" + filename), json);
        }

        // 更新配置键值对
        public static void AddUpdateAppSettings(string key, string value)
        {
            try
            {
                var configFile = WebConfigurationManager.OpenWebConfiguration("~");
                var settings = configFile.AppSettings.Settings;
                if (settings[key] == null)
                {
                    settings.Add(key, value);
                }
                else
                {
                    settings[key].Value = value;
                }
                configFile.Save();
                ConfigurationManager.RefreshSection(configFile.AppSettings.SectionInformation.Name);
            }
            catch (ConfigurationErrorsException)
            {
                Console.WriteLine("Error writing app settings");
            }
        }
    }
}