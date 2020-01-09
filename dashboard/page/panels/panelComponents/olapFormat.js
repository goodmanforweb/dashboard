
let olapFormat = {
		cata: {
			demension: [
				{
					name: '',
					qualifiedName: '',
					filter: {
						selection: {
							type: "EXCLUSION", //INCLUSION
							members: [{uniqueName: "[地区].[中国].[东北]", caption: "东北"}]
						},
						matchParam: {
							paramName: '',
							paramValue: ''
						},
						custom: {
							matchMethod: '',//[{name:"accurate",value:"精确匹配"},{name:"contain",value:"包含"},{name:"startWith",value:"开头为"},{name:"endWidth",value:"结尾为"},{name:"null",value:"为空"}];
							matchValue: ''
						}
					}
				},
				{
					name: '',
					qualifiedName: '',
					filter: {}
				},
				{
					name: '',
					qualifiedName: '',
					filter: {}
				}
			],
			rowFilter: {
				sortFilter: {
					topCount: {
						status: false,
						value: ''
					},
					endCount: {
						status: true,
						value: ''
					},
					sortBy: ''
				},
				valueFilter: {
					valueBy: '',
					operator: '',//['>','>=','<','<=','=','!=','非空']
					count: ''
				},
				ranking: {
					groupRank: {
						status: false,//boolean,
						value: ''//ascend decend
					},
					overallRank: {
						status: true,//boolean,
						value: ''//ascend decend
					}
				}
			}
		},
		series: {},
		measure: [],
		filter: {}
}