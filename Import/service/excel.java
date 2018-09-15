package service;


import entity.Excel;
import entity.Main_table;
import entity.Sub_table;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.neo4j.driver.v1.*;


import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.util.*;


/**
 * Created by 田鑫
 * 2018/8/28 22:07
 * 这里解析文件的路径是放在桌面上的，需要修改
 * 调查单和证券
 * time：时间
 * info_id：调查单代码；
 * exceptionname:异常行为名称
 * actname：调查事项
 * remark：备注（如果为空，就不显示）
 */
public class excel {

    public static String NEO4J_URL;
    public static String NEO4J_USER;
    public static String NEO4J_PASSWORD;
    public static String MAIN_TABLE;
    public static String SUB_TABLE;


    //用来存储错误信息
    public static Map<String, String> map = new HashMap<String, String>();

    public static void main(String[] args) throws Exception {

        //读取neo4j账户的信息
        mergeProperties("./Import/demo/resource.properties");

        //解析main_table.xlsx
        List<Main_table> main_tableList = parseMainExcel(new File("./Import/demo/" + MAIN_TABLE + ""));
        List<Sub_table> sub_tableList = parseSubExcel(new File("./Import/demo/" + SUB_TABLE + ""));

        /**
         * 判断我们的表格中是否有错误信息，如果有就打印出来，没有就创建节点
         */
        if (map.size() == 0) {
            //把两个excel解析出来的文件结合到一起
            List<Excel> excelList = mergeCell(main_tableList, sub_tableList);
            //添加节点信息到neo4j数据库中
            addNode(excelList);
        } else {
            int count = 0;
            for (Map.Entry<String, String> mapInfo : map.entrySet()) {
                System.out.println(++count + " " + mapInfo.getValue());
            }
        }

    }

    /**
     * 解析main_table.xlsx
     *
     * @param file
     * @return
     */
    public static List<Main_table> parseMainExcel(File file) {
        List<Main_table> main_tableList = new ArrayList<Main_table>();
        try {
            FileInputStream fileInputStream = new FileInputStream(file);
            XSSFWorkbook workbook = new XSSFWorkbook(fileInputStream);

            //根据名称获得指定Sheet对象
            XSSFSheet sheet1 = workbook.getSheet("sheet1");

            //获取每一行的东西
            for (Row row : sheet1) {
                if (row != null) {
                    //不录入表头的数据
                    if (row.getRowNum() == 0 || row.getRowNum() == 1) {
                        continue;
                    }

                    //用来记录表格中显示的行数
                    int i = row.getRowNum() + 1;
                    /**
                     * 调查单survey
                     */
                    String time = null;
                    if (!row.getCell(12).getStringCellValue().equals("")) {
                        time = row.getCell(12).getStringCellValue().trim();
                        String[] split = time.split(" ");
                        String[] split1 = split[0].split("/");
                        time = split1[0] + split1[1] + split1[2];
                    } else {
                        map.put(UUID.randomUUID().toString(), "excel中第" + i + "行，第13列值不可以为空");
                    }

                    String info_id = null;
                    if (!row.getCell(0).getStringCellValue().equals("")) {
                        info_id = row.getCell(0).getStringCellValue();
                    } else {
                        map.put(UUID.randomUUID().toString(), "excel中第" + i + "行，第1列值不可以为空");
                    }

                    //异常行为名称
                    //这里是因为某一行具有-导致有可能无法读取
                    String exceptionname = null;
                    if (!row.getCell(5).getStringCellValue().equals("")) {
                        row.getCell(5).setCellType(row.getCell(5).CELL_TYPE_STRING);
                        exceptionname = row.getCell(5).getStringCellValue();
                    } else {
                        map.put(UUID.randomUUID().toString(), "main_table中第" + i + "行，第6列值不可以为空");
                    }

                    String actname = null;
                    if (!row.getCell(1).getStringCellValue().equals("")) {
                        actname = row.getCell(1).getStringCellValue();
                    } else {
                        map.put(UUID.randomUUID().toString(), "main_table中第" + i + "行，第2列值不可以为空");
                    }

                    String remark = "";
                    if (row.getCell(7) != null) {
                        remark = row.getCell(7).getStringCellValue();
                    }

                    /**
                     * 股票属性 stock
                     */
                    if (!row.getCell(3).getStringCellValue().equals("")) {
                        String trim = row.getCell(3).getStringCellValue().trim();
                        String[] split = trim.split(" ");
                        if (split.length > 1) {
                            Main_table main_table = new Main_table(time, info_id, exceptionname, actname, remark, "survey",
                                    split[0], split[1], "stock");
                            main_tableList.add(main_table);
                        } else {
                            map.put(UUID.randomUUID().toString(), "main_table中第" + i + "行，第4列证券代码和名称需要使用空格分隔");
                        }
                    } else {
                        map.put(UUID.randomUUID().toString(), "main_table中第" + i + "行，第4列值不可以为空");
                    }


                }
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return main_tableList;
    }

    /**
     * 解析sub_table.xlsx
     *
     * @param file
     * @return
     */
    public static List<Sub_table> parseSubExcel(File file) {
        //账户，营业部，会员
        List<Sub_table> sub_tableList = new ArrayList<Sub_table>();
        try {
            FileInputStream fileInputStream = new FileInputStream(file);
            XSSFWorkbook workbook = new XSSFWorkbook(fileInputStream);
            //根据名称获得指定Sheet对象
            XSSFSheet sheet1 = workbook.getSheet("sheet1");
            for (Row row : sheet1) {
                if (row != null) {


                    //不录入表头的数据
                    if (row.getRowNum() == 0 || row.getRowNum() == 1) {
                        continue;
                    }

                    //用来记录表格中显示的行数
                    int i = row.getRowNum() + 1;

                    /**
                     * 账户属性
                     */
                    String accountCode = null;
                    if (!row.getCell(3).getStringCellValue().equals("")) {
                        accountCode = row.getCell(3).getStringCellValue().trim();
                    } else {
                        map.put(UUID.randomUUID().toString(), "sub_table中第" + i + "行，第4列值不可以为空");
                    }

                    String accountName = null;
                    if (!row.getCell(4).getStringCellValue().equals("")) {
                        accountName = row.getCell(4).getStringCellValue().trim();
                    } else {
                        map.put(UUID.randomUUID().toString(), "sub_table中第" + i + "行，第5列值不可以为空");
                    }

                    /**
                     *营业部属性 department
                     */
                    String departmentName = null;
                    if (!row.getCell(10).getStringCellValue().equals("")) {
                        departmentName = row.getCell(10).getStringCellValue().trim();
                    } else {
                        map.put(UUID.randomUUID().toString(), "sub_table中第" + i + "行，第11列值不可以为空");
                    }

                    /**
                     * 会员属性 member
                     */
                    String memberName = null;
                    if (!row.getCell(8).getStringCellValue().equals("")) {
                        memberName = row.getCell(8).getStringCellValue().trim();
                    } else {
                        map.put(UUID.randomUUID().toString(), "sub_table中第" + i + "行，第9列值不可以为空");
                    }


                    /**
                     * 对应主表的info_id
                     */
                    String info_id = null;
                    if (!row.getCell(1).getStringCellValue().equals("")) {
                        info_id = row.getCell(1).getStringCellValue().trim();
                    } else {
                        map.put(UUID.randomUUID().toString(), "sub_table中第" + i + "行，第2列值不可以为空");
                    }

                    Sub_table sub_table = new Sub_table(accountCode, accountName, "account",
                            departmentName, "department", memberName, "member", info_id);
                    sub_tableList.add(sub_table);
                }
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return sub_tableList;
    }

    /**
     * 合并excel
     *
     * @param main_tableList
     * @param sub_tableList
     */
    public static List<Excel> mergeCell(List<Main_table> main_tableList, List<Sub_table> sub_tableList) {
        List<Excel> excelList = new ArrayList<Excel>();
        try {
            if (main_tableList.size() > 0 && sub_tableList.size() > 0) {
                for (Main_table main_table : main_tableList) {
                    for (Sub_table sub_table : sub_tableList) {
                        Excel excel = new Excel();
                        BeanUtils.copyProperties(excel, main_table);
                        if (sub_table.getInfo_id().equals(excel.getInfo_id())) {
                            BeanUtils.copyProperties(excel, sub_table);
                            excelList.add(excel);
                        }
                    }
                }
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        return excelList;
    }

    /**
     * 配置文件信息
     *
     * @param file
     */
    public static void mergeProperties(String file) {
        try {
            //InputStream inStream = excel.class.getClassLoader().getResourceAsStream(file);

            FileInputStream inStream = new FileInputStream(file);
            Properties prop = new Properties();
            prop.load(inStream);
            NEO4J_URL = prop.getProperty("url");
            NEO4J_USER = prop.getProperty("user");
            NEO4J_PASSWORD = prop.getProperty("password");
            MAIN_TABLE = prop.getProperty("main_table");
            SUB_TABLE = prop.getProperty("sub_table");

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    /**
     * 节点生成
     *
     * @param excelList
     */
    public static void addNode(List<Excel> excelList) {

        //获取连接
        Driver driver = GraphDatabase.driver("bolt://" + NEO4J_URL + "",
                AuthTokens.basic(NEO4J_USER, NEO4J_PASSWORD));
        Session session = driver.session();
        Transaction transaction = session.beginTransaction();

        /**
         * 默认清空neo4j
         */
        transaction.run("match (n) detach delete n");

        /**
         * 创建节点和关系
         */
        int count = 0;
        for (Excel excel : excelList) {
            String s = "";
            //先判断这个节点是否存在
            StatementResult result = transaction.run("match (sr :survey) where sr.info_id=\"" + excel.getInfo_id() + "\" return sr.info_id as info_id");

            while (result.hasNext()) {
                Record record = result.next();
                s = record.get("info_id").asString();
            }

            if ("".equals(s)) {
                transaction.run("create\n" +
                        "(sr" + count + ": survey {time:" + excel.getTime() + ", info_id: \"" + excel.getInfo_id() + "\", exceptionname: \"" + excel.getExceptionname() + "\", " +
                        "actname: \"" + excel.getActname() + "\", remark: \"" + excel.getRemark() + "\", type: \"" + excel.getSurveyType() + "\"})," +
                        "(st" + count + ":stock{code:\"" + excel.getStockCode() + "\",name:\"" + excel.getStockName() + "\",type:\"" + excel.getStockType() + "\"})," +
                        "(ac" + count + ":account {name:\"" + excel.getAccountName() + "\",count:\"" + count + "\"," +
                        "code:\"" + excel.getAccountCode() + "\", type:\"" + excel.getAccountType() + "\",department:\"" + excel.getDepartmentName() + "\"})," +
                        "(dt" + count + ":department { name:\"" + excel.getDepartmentName() + "\",type:\"" + excel.getDepartmentType() + "\"})," +
                        "(mr" + count + ":member {name:\"" + excel.getMemberName() + "\",type:\"" + excel.getMembetType() + "\"}) " +

                        "create (sr" + count + ")-[:SURVEY]->(st" + count + ")," +
                        "(sr" + count + ")-[:SURVEY]->(ac" + count + ")," +
                        "(ac" + count + ")-[:BELONG_TO]->(dt" + count + ")," +
                        "(dt" + count + ")-[:BELONG_TO]->(mr" + count + ")");
            } else {
                /**
                 * 每次插入的时候定义一个count值，这个count值是我判断子节点的唯一性的标识
                 * 这里需要判断子节点是否存在，默认为不可重复
                 */
                String s1 = "";
                StatementResult accountResult = transaction.run("match (ac:account) where ac.count=\"" + count + "\" return ac.count as count");
                while (accountResult.hasNext()) {
                    Record record = accountResult.next();
                    s1 = record.get("count").asString();
                }
                if ("".equals(s1)) {
                    transaction.run("create\n" +
                            "(ac" + count + ":account {name: \"" + excel.getAccountName() + "\",count:\"" + count + "\"," +
                            "code:\"" + excel.getAccountCode() + "\", type:\"" + excel.getAccountType() + "\",department:\"" + excel.getDepartmentName() + "\"})," +
                            "(dt" + count + ":department { name:\"" + excel.getDepartmentName() + "\",type:\"" + excel.getDepartmentType() + "\"})," +
                            "(mr" + count + ":member {name:\"" + excel.getMemberName() + "\",type:\"" + excel.getMembetType() + "\"}) " +

                            "create (ac" + count + ")-[:BELONG_TO]->(dt" + count + ")," +
                            "(dt" + count + ")-[:BELONG_TO]->(mr" + count + ")");
                    /**
                     * 添加调查单和账户的关系
                     */
                    transaction.run("match (sr:survey),(ac:account) where sr.info_id=\"" + excel.getInfo_id() + "\" and ac.count =\"" + count + "\"" +
                            " create (sr)-[:SURVEY]->(ac)");
                }

            }
            transaction.success();
            count++;
        }

        transaction.close();
        session.close();
        driver.close();
    }

}

