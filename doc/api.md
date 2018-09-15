[TOC]
## 1. demo

```
create
(sr1: survey {time: 20180818, info_id: "991000000000000000", exceptionname: "打压债券收盘价", actname: "拉升（打压）债券价格", remark: "", type: "survey"}),
(st1: stock {code: "600639", name: "浦东金桥", type: "stock"}),
(ac1: account {code: "000001", name: "张三", type: "account"}),
(ac2: account {code: "000002", name: "李四", type: "account"}),
(ac3: account {code: "000003", name: "王五", type: "account"}),
(mr1: member {code: "100001", name: "中信证券", type: "member"}),
(mr2: member {code: "200001", name: "光大证券", type: "member"}),
(mr3: member {code: "300001", name: " 海通证券", type: "member"}),
(dt1: department {name: "杭州四季路证券营业部", type: "department"}),
(dt2: department {name: "上海世纪大道证券营业部", type: "department"}),
(dt3: department {name: "上海民生路证券营业部", type: "department"}),
(sr2: survey {time: 20180819, info_id: "991000000000000001", exceptionname: "违规交易", actname: "违规交易", remark: "", type: "survey"}),
(st2: stock {code: "600689", name: "浦东股票", type: "stock"})

create (sr1)-[:SURVEY]->(ac1),
(sr1)-[:SURVEY]->(ac2),
(sr1)-[:SURVEY]->(ac3),

(sr1)-[:SURVEY]->(st1),

(ac1)-[:BELONG_TO]->(dt1),
(ac2)-[:BELONG_TO]->(dt2),
(ac3)-[:BELONG_TO]->(dt3),

(dt1)-[:BELONG_TO]->(mr1),
(dt2)-[:BELONG_TO]->(mr2),
(dt3)-[:BELONG_TO]->(mr3),

(sr2)-[:SURVEY]->(ac1),
(sr2)-[:SURVEY]->(st2)
```
```
create
(sr1: survey {time: 20180818, info_id: "991000000000000000", exceptionname: "打压债券收盘价", actname: "拉升（打压）债券价格", remark: "", type: "survey"}),
(st1: stock {code: "600639", name: "浦东金桥", type: "stock"}),
(ac1: account {code: "000001", name: "张三", type: "account"}),
(ac2: account {code: "000002", name: "李四", type: "account"}),
(ac3: account {code: "000003", name: "王五", type: "account"}),
(ac4: account {code: "000003", name: "马六", type: "account"}),
(mr1: member {code: "100001", name: "中信证券", type: "member"}),
(mr2: member {code: "200001", name: "光大证券", type: "member"}),
(dt1: department {name: "杭州四季路证券营业部", type: "department"}),
(dt2: department {name: "上海世纪大道证券营业部", type: "department"}),
(dt3: department {name: "上海民生路证券营业部", type: "department"})
create (sr1)-[:SURVEY]->(ac1),
(sr1)-[:SURVEY]->(ac2),
(sr1)-[:SURVEY]->(ac3),
(sr1)-[:SURVEY]->(ac4),

(sr1)-[:SURVEY]->(st1),

(ac1)-[:BELONG_TO]->(dt1),
(ac2)-[:BELONG_TO]->(dt2),
(ac3)-[:BELONG_TO]->(dt3),
(ac4)-[:BELONG_TO]->(dt3),

(dt1)-[:BELONG_TO]->(mr1),
(dt2)-[:BELONG_TO]->(mr2),
(dt3)-[:BELONG_TO]->(mr2)
```



## 2. 节点属性

```
调查单属性：
	info_id：调查单代码；
	exceptionname:异常行为名称
	actname：调查事项
	time：时间
	remark：备注（如果为空，就不显示）
```

```
账户属性
	code： 账户代码
	name：账户名称
```

```
股票属性：
	code：股票代码
	name：股票名称
```

```
营业部属性
	name：名称
```

```
会员属性
	name：名称
```

## 3. 接口

```
POST http://139.219.231.49:7474/db/data/cypher
Accept: application/json; charset=UTF-8
Content-Type: application/json
Authorization: Basic bmVvNGo6Y2xvdWRicmFpbg==
```

### 1. 返回近3个月的所有的节点和关系

**request:**

```
{
  "query": "match (st:stock)<-[:SURVEY]-(survey)-[:SURVEY]->(ac)-[:BELONG_TO]->(dt)-[:BELONG_TO]->(mr) where survey.time >= {start} and survey.time <= {end} return st, survey, ac, dt, mr",
  "params": {
    "start": 20180818,
    "end": 20180819
  }
}
```

### 2. 按账户名称查询

**parameter:**	

1. 账户名称
2. 开始时间
3. 结束时间

**request:**

```
{
  "query": "match (st:stock)<-[:SURVEY]-(survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt)-[:BELONG_TO]->(mr) where survey.time >= {start} and survey.time <= {end} and ac.name = ~'.*{name}.*' return st, survey, ac, dt, mr",
  "params": {
    "name": "张三",
    "start": 20180818,
    "end": 20180819
  }
}
```

### 3. 按账户编码查询

**parameter:**	

1. 账户名称
2. 开始时间
3. 结束时间

**request:**

```
{
  "query": "match (st:stock)<-[:SURVEY]-(survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt)-[:BELONG_TO]->(mr) where survey.time >= {start} and survey.time <= {end} and ac.code = ~'.*{code}.*' return st, survey, ac, dt, mr",
  "params": {
    "code": "000001",
    "start": 20180818,
    "end": 20180819
  }
}
```



### 4. 按证券名称查询

**parameter:**	

1. 证券名称
2. 开始时间
3. 结束时间

**request:**

```
{
  "query": "match (survey)-[:SURVEY]->(st:stock), (survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt)-[:BELONG_TO]->(mr) where survey.time >= {start} and survey.time <= {end} and st.name = ~'.*{name}.*' return st, survey, ac, dt, mr",
  "params": {
    "name": "浦东金桥",
    "start": 20180818,
    "end": 20180819
  }
}
```

###5. 按证券编码查询

**parameter:**	

1. 证券编码
2. 开始时间
3. 结束时间

**request:**

```
{
  "query": "match (survey)-[:SURVEY]->(st:stock), (survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt)-[:BELONG_TO]->(mr) where survey.time >= {start} and survey.time <= {end} and st.code = ~'.*{code}.*' return st, survey, ac, dt, mr",
  "params": {
    "code": "600639",
    "start": 20180818,
    "end": 20180819
  }
}
```

### 6. 按调查单编号查询

**parameter:**	

1. 调查单编号
2. 开始时间
3. 结束时间

**request:**

```
{
  "query": "match (st:stock)<-[:SURVEY]-(survey:survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt)-[:BELONG_TO]->(mr) where survey.time >= {start} and survey.time <= {end} and survey.info_id = ~'.*{info_id}.*' return st, survey, ac, dt, mr",
  "params": {
    "info_id": "991000000000000000",
    "start": 20180818,
    "end": 20180819
  }
}
```

### 7. 按会员名称查询

**parameter:**	

1. 会员名称
2. 开始时间
3. 结束时间

**request:**

```
{
  "query": "match (st:stock)<-[:SURVEY]-(survey:survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt:department)-[:BELONG_TO]->(mr:member) where survey.time >= {start} and survey.time <= {end} and mr.name = ~'.*{name}.*' return st, survey, ac, dt, mr",
  "params": {
    "name": "光大证券",
    "start": 20180818,
    "end": 20180819
  }
}
```

### 8. 按会员营业部查询	

**parameter:**

1. 会员营业部名称
2. 开始时间
3. 结束时间

```
{
  "query": "match (st:stock)<-[:SURVEY]-(survey:survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt:department)-[:BELONG_TO]->(mr:member) where survey.time >= {start} and survey.time <= {end} and dt.name= ~'.*{name}.*' return st, survey, ac, dt, mr",
  "params": {
    "name": "上海世纪大道证券营业部",
    "start": 20180818,
    "end": 20180819
  }
}
```
