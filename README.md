# 一个简易的扫雷网页

## 一、 对于扫雷的一些想法
拿到这个题的第一个想法就是想尽量复原一个xp系统自带的扫雷游戏，尽量还原其游戏界面，实现其各种功能。

## 二、 基础部分
- 布局
    - 顶部的游戏、帮助按钮
    - 中部 包括：文字提示的雷数、计时器、restart按钮
    - 底部扫雷游戏界面
- 游戏
    - 左键点击后显示 空白/地雷/数字
    - 右键点击 标旗子
    - 确定雷的坐标
    - 点击空白格时拓展至边缘
    - 点击雷时失败
    - 所有非雷格子被点开时胜利
- 算法
    - 分别用二维数组`block[11][11]`存储每一个格子， `number[11][11]`存储每个格子的数字 0表示空格 9表示雷

    - 统计地雷数，计时，点击按钮重来

    - 按行数列数生成`<div>`, 点击后改变样式

    - 用dfs搜索空白格并翻开其边界边界

    - 点击格子检查对应数字
        - 在number数组中查找所点击格子对应的数字(0为安全，1为雷格)
        - 0：展开到边界
        - 1 ~ 8： 显示对应数字
        - 9：所选背景为红色，翻开其他雷，检查是否标错，错误打叉

    - 右键 在格子上标棋

## 三、 进阶部分
- 顶部 下拉选项卡增加功能
- 选择难度：初级、中级、高级、自定义
- 中部 添加数码管显示图片、 添加按钮的三种表情
- 数字、旗子等的图片显示
- 左右键同时
- 第一次不会是雷
- 网络请求、上传分数
- 提示窗口
- 排名系统

## 四、 其他高级功能
- 游戏规则窗口
- 反馈窗口