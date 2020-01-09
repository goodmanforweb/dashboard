export default dataForPanel => ({
    // style: {
    //   name: '样式',
    //   value: [
    //     {
    //       type: 'string',
    //       name: 'width',
    //       cname:'宽度',
    //       widget: 'XRadioInput',
    //       disable: false,
    //       visible: true,
    //       belongTo: 'style',
    //       option: [{name:'适应内容',value:'auto', defaultValue: 'auto'},{name:'固定',value:'custom', unit:'px',defaultValue: 100}],
    //       defaultValue: 'auto',
    //     },
    //     {
    //       type: 'string',
    //       cname:'高度',
    //       name:'height',
    //       widget: 'XRadioInput',
    //       disable: false,
    //       visible: true,
    //       belongTo: 'style',
    //       option: [{name:'适应内容',value:'auto', defaultValue: 'auto'},{name:'固定',value:'custom', unit:'px',defaultValue: 100}],
    //       defaultValue: 'auto',
    //     }
    //   ]
    // },
    image: {
        name: "图片",
        value: [
            {
                type: "string",
                cname: "文件/URL",
                name: "fileSrc",
                widget: "XFileSrc",
                disable: false,
                visible: true,
                belongTo: "image",
                option: {
                    src:
                        "/filename/api/repo/files/tree?filter=*.jpg|*.png|*.gif|*.bmp&_=1389042244770",
                    type: "image"
                },
                defaultValue: ""
            },
            {
                type: "string",
                cname: "图片位置",
                name: "imgPosition",
                widget: "XRadio",
                disable: false,
                visible: true,
                belongTo: "image",
                option: [
                    { name: "居中", value: "center" },
                    { name: "拉伸", value: "caver" },
                    { name: "填充", value: "scale" },
                    { name: "平铺", value: "flat" }
                ],
                defaultValue: "top"
            }
        ]
    }
});
