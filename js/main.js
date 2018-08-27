console.log(data);
var res = data[0].data;
var _data = [];
var _links = [];
var main = res[0].row[1];
var categoryMatch = {
    'stock': '股票',
    'account': '账户',
    'department': '营业部',
    'member': '会员',
    'survey': '调查单'
}
_data.push({
    "category": categoryMatch[main.type],
    "draggable": true,
    "name": main.actname,
    "symbolSize": 140,
    'symbol': 'image://../images/' + main.type + '.png'
});
for (var i in res) {
    var row = res[i].row;
    console.log(row);
    if (row[2] == "SURVEY") {
        _data.push({
            "category": categoryMatch[row[4][0]],
            "draggable": true,
            "name": row[3].name,
            "symbolSize": 80,
            'symbol': 'image://../images/' + row[4][0] + '.png'
        });
        _links.push({
            "source": main.actname,
            "target": row[3].name
        });
    } else if (row[2] == "BELONG_TO") {
        _data.push({
            "category": categoryMatch[row[4][0]],
            "draggable": true,
            "name": row[3].name,
            "symbolSize": 64,
            'symbol': 'image://../images/' + row[4][0] + '.png'
        });
        _links.push({
            "source": row[1].name,
            "target": row[3].name
        });
    }
}
var myChart = echarts.init(document.getElementById('main'));
var option = {
    "animationEasingUpdate": "quinticInOut",
    "animationDurationUpdate": 1500,
    "color": [
        "#FF4A36",
        "#1E53C3",
        "#19B248",
        "#F2C311"
    ],
    "textStyle": {
        "fontFamily": "sans-serif",
        "fontSize": 12,
        "fontStyle": "normal",
        "fontWeight": "normal"
    },
    "animation": "auto",
    "animationDuration": 500,
    "animationEasing": "exponentialOut",
    "animationThreshold": 1000,
    "progressiveThreshold": 1000,
    "progressive": 400,
    "hoverLayerThreshold": 1000,
    "useUTC": false,
    "series": [{
        "label": {
            "normal": {
                "position": "bottom",
                "textStyle": {
                    "fontSize": 12
                },
                "show": true
            }
        },
        "type": "graph",
        "lineStyle": {
            "normal": {
                "opacity": 1,
                "width": 2,
                "curveness": 0,
                "type": "dotted"
            }
        },
        "data": _data,
        "categories": [{
            "name": "股票"
        }, {
            "name": "调查单"
        }, {
            "name": "账户"
        }, {
            "name": "营业部"
        }, {
            "name": "会员"
        }],
        "layout": "force",
        "symbolSize": 2,
        "force": {
            "repulsion": 600,
            "edgeLength": [100, 300]
        },
        "roam": true,
        "focusNodeAdjacency": true,
        "links": _links
    }],
    "legend": [{
        "x": "50px",
        "y": "40px",
        "data": ["股票", "调查单", "账户", "营业部", "会员"]
    }],
    // "tooltip": {
    //     "formatter": function(param) {
    //         if (param.dataType === 'edge') {
    //             // return param.data.category + ': ' + param.data.target;
    //         }
    //         return param.data.category + ': ' + param.data.name;
    //     }
    // },
    "tooltip": {
        "enterable": true,
        "hideDelay": 100,
        "backgroundColor": '#1E3054',
        "borderRadius": 10,
        "padding": 8,
        "textStyle": {
            "color": '#FFF'
        },
        "formatter": function(param) {
            if (param.dataType === 'edge') {
            // return param.data.category + ': ' + param.data.target;
        }
        return param.data.category + ': ' + param.data.name;
        }
    },
    "animationEasingUpdate": "quinticInOut",
    "animationDurationUpdate": 1000
};
myChart.setOption(option);