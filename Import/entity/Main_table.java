package entity;

import java.io.Serializable;

/**
 * Created by 田鑫
 * 2018/8/30 8:53
 */
public class Main_table implements Serializable {
    /**
     * 调查单属性
     */
    private String time;
    private String info_id;
    private String exceptionname;
    private String actname;
    private String remark;
    private String surveyType;

    /**
     * 股票属性
     */
    private String stockCode;
    private String stockName;
    private String stockType;


    public Main_table() {
    }

    public Main_table(String time, String info_id, String exceptionname, String actname, String remark, String surveyType, String stockCode, String stockName, String stockType) {
        this.time = time;
        this.info_id = info_id;
        this.exceptionname = exceptionname;
        this.actname = actname;
        this.remark = remark;
        this.surveyType = surveyType;
        this.stockCode = stockCode;
        this.stockName = stockName;
        this.stockType = stockType;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getInfo_id() {
        return info_id;
    }

    public void setInfo_id(String info_id) {
        this.info_id = info_id;
    }

    public String getExceptionname() {
        return exceptionname;
    }

    public void setExceptionname(String exceptionname) {
        this.exceptionname = exceptionname;
    }

    public String getActname() {
        return actname;
    }

    public void setActname(String actname) {
        this.actname = actname;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getSurveyType() {
        return surveyType;
    }

    public void setSurveyType(String surveyType) {
        this.surveyType = surveyType;
    }

    public String getStockCode() {
        return stockCode;
    }

    public void setStockCode(String stockCode) {
        this.stockCode = stockCode;
    }

    public String getStockName() {
        return stockName;
    }

    public void setStockName(String stockName) {
        this.stockName = stockName;
    }

    public String getStockType() {
        return stockType;
    }

    public void setStockType(String stockType) {
        this.stockType = stockType;
    }
}
