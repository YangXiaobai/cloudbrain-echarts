package entity;

/**
 * Created by 田鑫
 * 2018/8/30 10:32
 */
public class Sub_table {
    /**
     * 账户属性
     */
    private String accountCode;
    private String accountName;
    private String accountType;

    /**
     * 营业部属性
     */
    private String departmentName;
    private String departmentType;


    /**
     * 会员属性
     */
    private String memberName;
    private String membetType;

    //对应主表的info_id
    private String info_id;

    public Sub_table() {
    }

    public Sub_table(String accountCode, String accountName, String accountType, String departmentName, String departmentType, String memberName, String membetType, String info_id) {
        this.accountCode = accountCode;
        this.accountName = accountName;
        this.accountType = accountType;
        this.departmentName = departmentName;
        this.departmentType = departmentType;
        this.memberName = memberName;
        this.membetType = membetType;
        this.info_id = info_id;
    }

    public String getInfo_id() {
        return info_id;
    }

    public void setInfo_id(String info_id) {
        this.info_id = info_id;
    }

    public String getAccountCode() {
        return accountCode;
    }

    public void setAccountCode(String accountCode) {
        this.accountCode = accountCode;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getDepartmentType() {
        return departmentType;
    }

    public void setDepartmentType(String departmentType) {
        this.departmentType = departmentType;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public String getMembetType() {
        return membetType;
    }

    public void setMembetType(String membetType) {
        this.membetType = membetType;
    }
}
