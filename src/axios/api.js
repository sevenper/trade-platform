import { get, post, postParams } from './baseService';

// 获取产品配置信息
export function getProductSetting(options) {
    return post('/api/admin/getProductSetting.do', options);
}
// 申购
export function xingusg(options) {
    // return get('/new/public/index.php/api/Newlist/index', options)
    // return post('/api/xingu/getXinguList.do', options)
    return postParams('/api/xingu/getList.do', options);
}

//新股冻结资金
export function getprice(options) {
    // return get('/new/public/index.php/api/Lists/getprice', options)
    return get('/api/xingu/getPrice.do', options);
}

// 申购提交列表
export function xingusgsList(options) {
    // return get('/new/public/index.php/api/Lists/index', options)
    return post('/api/xingu/getUserXgList.do', options);
}

// 登录
export function login(options) {
    return postParams('/api/user/login.do', options);
}

// 注册
export function register(options) {
    return postParams('/api/user/reg.do', options);
}
// 注册
export function regByEmail(options) {
    return post('/api/user/regByEmail.do', options);
}
// 注销登录
export function logout(options) {
    return post('/api/user/logout.do', options);
}

// 验证是否注册（电话）
export function checkPhone(options) {
    return post('/api/user/checkPhone.do', options);
}

// 验证是否注册（邮箱）
export function checkEmail(options) {
    return post('/api/user/checkEmail.do', options);
}

// 更改密码 -- 忘记密码
export function forgetPas(options) {
    return get('/api/user/updatePwd.do', options);
}

//提现密码
export function tixian(options) {
    return get('/user/tixian.do', options);
}

// 修改密码
export function changePassword(options) {
    return get('/user/updatePwd.do', options);
}

// 获取验证码  -- 注册
export function getCode(options) {
    return get('/api/sms/sendRegSms.do', options);
}

// 获取验证码  -- 注册
export function getCode_email(options) {
    return post('/api/user/sendRegEmail.do', options);
}
// 获取验证码  -- 忘记密码
export function sendForgetSms(options) {
    return get('/api/sms/sendForgetSms.do', options);
}

// 获取图片验证码   -- 查看验证码
export function getCode2(options) {
    return get('/code/getCode.do', options);
}

// 验证图片验证码 -- 验证
export function checkCode(options) {
    return get('/code/checkCode.do', options);
}

// /*** 首页 ****/
// 查询首页显示的指数
export function getIndexMarket(options) {
    return get('/api/index/queryHomeIndex.do', options);
}

// 查询列表页显示的指数
export function getListMarket(options) {
    return get('/api/index/queryListIndex.do', options);
}

// 查询指数是否可交易
export function getTransMarket(options) {
    return get('/api/index/queryTransIndex.do', options);
}

// 获取大盘指数
export function getMarket(options) {
    return get('/api/stock/getMarket.do', options);
}

// 股票列表数据
export function getStock(options) {
    return postParams('/api/stock/getStock.do', options);
}

// 单只股票行情数据
export function getSingleStock(options) {
    return postParams('/api/stock/getSingleStock.do', options);
}

// 单只指数行情数据
export function getSingleIndex(options) {
    return post('/api/index/querySingleIndex.do', options);
}

// 添加自选
export function addOption(options) {
    return postParams('/user/addOption.do', options);
}

// 删除自选
export function delOption(options) {
    return postParams('/user/delOption.do', options);
}

// 获取期货列表
export function getFutures(options) {
    return get('/api/futures/queryList.do', options);
}

// 获取首页显示的期货列表
export function getHomeFutures(options) {
    return get('/api/futures/queryHome.do', options);
}

// 查询期货产品的交易状态
export function queryTrans(options) {
    return get('/api/futures/queryTrans.do', options);
}

// 查询基币的汇率，对外暴露
export function queryExchange(options) {
    return get('/api/futures/queryExchange.do', options);
}

// 查询单个期货产品的行情（行情源的数据）
export function querySingleMarket(options) {
    return get('/api/futures/querySingleMarket.do', options);
}

// 期货下单
export function buyFutures(options) {
    return post('/user/buyFutures.do', options);
}

// 下单
export function buy(options) {
    return postParams('/user/buy.do', options);
}

// 指数下单
export function indexBuy(options) {
    return post('/user/buyIndex.do', options);
}

// 用户平仓
export function sell(options) {
    return postParams('/user/sell.do', options);
}

// 指数平仓
export function sellIndex(options) {
    return post('/user/sellIndex.do', options);
}

// 期货平仓
export function sellFutures(options) {
    return post('/user/sellFutures.do', options);
}

// /***用户中心***/
// 用户资金户转
export function AmtChange(options) {
    return postParams('/user/transAmt.do', options);
}

// 用户详情
export function getUserInfo(options) {
    return post('/user/getUserInfo.do', options);
}

// 添加银行卡
export function addBankCard(options) {
    return postParams('/user/bank/add.do', options);
}

// 修改银行卡
export function updateBankCard(options) {
    return postParams('/user/bank/update.do', options);
}

// 获取银行卡信息
export function getBankCard(options) {
    return post('/user/bank/getBankInfo.do', options);
}

// 获取我的持仓单
export function getOrderList(options) {
    return postParams('/user/position/list.do', options);
}

// 获取我的持仓单 - 指数
export function getIndexOrderList(options) {
    return post('/user/index/position/list.do', options);
}

// 获取我的持仓单 - 期货
export function getFuturesOrderList(options) {
    return post('/user/futures/position/list.do', options);
}

// 获取我的自选列表
export function getMyList(options) {
    return post('/user/option/list.do', options);
}

// 实名认证
export function userAuth(options) {
    return postParams('/user/auth.do', options);
}

// 资金明细
export function cashDetail(options) {
    return post('/user/cash/list.do', options);
}

// 提现记录
export function rechargeList(options) {
    return postParams('/user/recharge/list.do', options);
}

// 充值记录
export function withdrawList(options) {
    return post('/user/withdraw/list.do', options);
}

// 充值
export function inMoney(options) {
    return post('/user/recharge/inMoney.do', options);
}

// 提现
export function outMoney(options) {
    return postParams('/user/withdraw/outMoney.do', options);
}

// 取消提现
export function canceloutMoney(options) {
    return post('/user/withdraw/cancel.do', options);
}

// k线图
export function getMinK(options) {
    return post('/api/stock/getMinK.do', options);
}

// k线图
export function getMinKEcharts(options) {
    return postParams('/api/stock/getMinK_Echarts.do', options);
}

// 是否已添加自选
export function isOption(options) {
    return postParams('/user/isOption.do', options);
}

// 获取网站设置信息
export function getSetting(options) {
    return post('/api/admin/getSetting.do', options);
}

// 获取指数网站设置信息
export function getIndexSetting(options) {
    return post('/api/admin/getIndexSetting.do', options);
}

// 获取期货网站设置信息
export function getFuturesSetting(options) {
    return post('/api/admin/getFuturesSetting.do', options);
}

// 获取首页banner
export function getBannerByPlat(options) {
    return post('/api/site/getBannerByPlat.do', options);
}

// 公告列表
export function getArtList(options) {
    return post('/api/art/list.do', options);
}

// 公告详情
export function getArtDetail(options) {
    return post('/api/art/detail.do', options);
}

// 获取支付渠道
export function getPayInfo(options) {
    return post('/api/site/getPayInfo.do', options);
}

// 获取单个渠道信息
export function getPayInfoDetail(options) {
    return post('/api/site/getPayInfoById.do', options);
}

// 获取网站设置信息
export function getInfoSite(options) {
    return post('/api/site/getInfo.do', options);
}

// k线图 分时
export function getMinuteLine(options) {
    return post('/api/realTime/findStock.do', options);
}

// 新增渠道  支付宝扫码
export function getjuhe1(options) {
    return post('/user/pay/juhe1.do', options);
}

//H5支付
export function getjuheH5(options) {
    return post('/user/pay/juheh5.do', options);
}

// 支付渠道
export function payLInk(url, options) {
    return post(url, options);
}

// 图片上传 uploadimg
export function uploadimg(options) {
    return post('/user/upload.do', options);
}

// 查询点差费率
export function findSpreadRateOne(options) {
    return post('/api/user/findSpreadRateOne.do', options);
}

// ==================最新修改内容：日线、添加自选等，2020年7月10日15:37:20======================
// 期货分钟-k线图
export function getFuturesMinKEcharts(options) {
    return post('/api/stock/getFuturesMinK_Echarts.do', options);
}

// 指数分钟-k线图
export function getIndexMinKEcharts(options) {
    return post('/api/stock/getIndexMinK_Echarts.do', options);
}

// 股票日线图
export function getDayK(options) {
    return post('/api/stock/getDayK.do', options);
}

// 期货日线图
export function getFuturesDayK(options) {
    return post('/api/stock/getFuturesDayK.do', options);
}

// 指数日线图
export function getIndexDayK(options) {
    return post('/api/stock/getIndexDayK.do', options);
}

// 查询期货详情
export function queryFuturesByCode(options) {
    return get('/api/futures/queryFuturesByCode.do', options);
}

// ==================最新修改内容：新版-新闻资讯、交易大厅，2020年8月26日10:39======================

// 查询期货详情
export function queryNewsList(options) {
    return get(`/api/news/getNewsList.do`, options);
}

// 配资申请-用户配资列表
export function getUserApplyList(options) {
    return post('/user/funds/getUserApplyList.do', options);
}

// -----分仓配资----- 2020 08 30

export function getFundsSetting(options) {
    return post('/user/funds/getFundsSetting.do', options);
}

// 查询配资类型杠杆
export function getFundsTypeList(options) {
    return post('/user/funds/getFundsTypeList.do', options);
}

// 配资申请-添加
export function addFundsApply(options) {
    return post('/user/funds/addFundsApply.do', options);
}
//分仓下单
export function buyFunds(options) {
    return post('/user/funds/buyFunds.do', options);
}

// 配资申请-用户操盘中子账户
export function getUserSubaccount(options) {
    return post('/user/funds/getUserSubaccount.do', options);
}

// 获取消息列表
export function getNoticeList(options) {
    return post('/user/cash/getMessagelist.do', options);
}

// 获取消息列表No
export function getNoticeListNo(options) {
    return post('/user/cash/getMessagelistno.do', options);
}

// 分仓交易-获取我的配资持仓单
export function getFundsOrderList(options) {
    return post('/user/funds/fundsList.do', options);
}

// 分仓交易-配资平仓
export function sellFunds(options) {
    return post('/user/funds/sellFunds.do', options);
}

//获取折价交易列表
export function getPremiumList(options) {
    return postParams('/api/premium/list.do', options);
}
//购买股票
export function xingusgs(options) {
    // return post('/new/public/index.php/api/Lists/add', options)
    return postParams('/api/xingu/addXingu.do', options);
}

// 溢價下单
export function premiumbuy(options) {
    return postParams('/user/premiumbuy.do', options);
}

// 获取杠杠
export function leverlist() {
    return post('/user/leverlist.do');
}
// 修改用户头像
export function updateNameAvatarImg(options) {
    return postParams('/user/updateNameAvatarImg.do', options);
}

// 获取k线周 月
export function getStockData(options) {
    return post('/api/stock/getStockData.do', options);
}

// 获取挂单列表
export function pendingOrderList(options) {
    return postParams('/user/position/pendingOrderList.do', options);
}

// 新股抢筹提交
export function buyNewShares(options) {
    return post('/api/xingu/buyNewShares.do', options);
}

// 龙虎榜列表
export function getDragonTigerList(options) {
    return post('/api/realTime/getDragonTigerList.do', options);
}
// 快捷登录
export function quickLoginPhone(options) {
    return post('/api/user/quickLoginPhone.do', options);
}

// 获取资金流向
export function getTheFlowOfFunds(options) {
    return post('/api/stream/getTheFlowOfFunds.do', options);
}

// vip 抢筹 -- 一字板抢筹
export function getDragonTigerRushList(options) {
    return post('/api/realTime/getDragonTigerRushList.do', options);
}

// 注册生效公司柱状图
export function effectiveCompanyHistogram(options) {
    return post('/api/ipo/getEffectiveCompanyHistogram.do', options);
}

// 注册生效公司列表
export function activeCompanyListData(options) {
    return post('/api/ipo/getActiveCompanyListData.do', options);
}

// 即将发行公司
export function upcomingCompanyData(options) {
    return post('/api/ipo/getUpcomingCompanyData.do', options);
}

// 即将发行公司上市列表
export function upcomingCompanyList(options) {
    return post('/api/ipo/getUpcomingCompanyList.do', options);
}

// 热门股票列表
export function popularStockSearch(options) {
    return post('/api/stock/getPopularStockSearch.do', options);
}

// 基金列表
export function getFundList(options) {
    return post('/api/fund/getFundList.do', options);
}

// 基金购买
export function buyFund(options) {
    return post('/api/fund/buyFund.do', options);
}

// 基金记录
export function getFundRecord(options) {
    return post('/api/fund/getFundRecord.do', options);
}

// 资金流向
export function homeFundFlow(options) {
    return post('/api/stream/getHomeFundFlow.do', options);
}

// 热点题材
export function topicList(options) {
    return post('/api/topic/getTopicList.do', options);
}

// 待上市
export function treatListing(options) {
    return post('/api/xingu/getStocksListed.do', options);
}

// 首页排行榜
export function leaderBoardData(options) {
    return post('/api/stock/getLeaderBoardData.do', options);
}

// 获取弹窗信息
export function userMessage(options) {
    return post('/user/getUserMessage.do', options);
}

// 更新价格
export function stockQuote(options) {
    return post1('/stockQuote', options);
}

// 兑换记录
export function transList(options) {
    return post('/user/transList.do', options);
}
// 协议配售下单
export function buyAgreementPlacement(options) {
    return post('/api/xingu/buyAgreementPlacement.do', options);
}
// 龙虎棒
export function getStockHotList(options) {
    return post('/api/stock/getStockHotList.do', options);
}

// 首页排行榜
export function getDragonTigerRushListNews(options) {
    return post('/api/realTime/getDragonTigerRushListNews.do', options);
}

// 获取新股上市票
export function getPerformance(options) {
    return post('/api/xingu/getPerformance.do', options);
}

export function checkCodeRight(options) {
    return post('/code/checkCodeRight.do', options);
}

export function getCompanies(options) {
    return post('/api/news/getCompanies.do', options);
}

export function getStockNews(options) {
    return post('/api/news/getCompanies.do', options);
}

// 卖出基金
export function sellFund(options) {
    return post('/api/fund/sellFund.do', options);
}

// 选择期权天数
export function configs(options) {
    return post('/api/options/configs.do', options);
}

// 期权买入
export function optionsBuy(options) {
    return post('/api/options/buy.do', options);
}

// 获取期权购买记录
export function optionsList(options) {
    return post('/api/options/list.do', options);
}

// 查询配息基金
export function getUserPlacing(options) {
    return post('/api/xingu/getUserPlacing.do', options);
}

// 获取任务配置
export function listTask(options) {
    return get('/user/newuser/task/list.do', options);
}

// 领取任务奖励
export function edtTask(options) {
    return get('/user/newuser/task/get.do', options);
}

// 获取借券
export function getBorrowList(options) {
    return post('/api/borrow/getBorrowList.do', options);
}

// 购买借券
export function buyBorrow(options) {
    return post('/api/borrow/buyBorrow.do', options);
}

// 借券记录
export function getUserBorrowRecord(options) {
    return post('/api/borrow/getUserBorrowRecord.do', options);
}

// 一字板购买
export function buySpecial(options) {
    return post('/user/buySpecial.do', options);
}

// 投诉邮件
export function makeComplaint(options) {
    return post('/user/makeComplaint.do', options);
}

// 获取当前多少条未读信息
export function getUnreadMessage(options) {
    return post('/user/getUnreadMessage.do', options);
}

// 全部弹窗消息
export function userInfoMessage(options) {
    return post('/user/getUserMessage.do?all=1', options);
}

// AI股票列表
export function aitradelist(options) {
    // return get('/new/public/index.php/api/Newlist/index', options)
    // return post('/api/xingu/getXinguList.do', options)
    return get('/api/ai/trade/list.do', options);
}
// AI股票列表 购买
export function aitradelistbuy(options) {
    return get('/api/ai/trade/buy.do', options);
}
// AI股票列表记录
export function aitraderecord(options) {
    return get('/api/ai/trade/record/list.do', options);
}

// AI股票列表记录2
export function aipositionlist(options) {
    return get('user/position/list.do', options);
}

// 虚拟币买入
export function getBuyCurrency (options) {
  return post('/api/currency/buyCurrency.do', options)
}

// 虚拟币记录
export function getUserCurrencyHaves (options) {
  return post('/api/currency/getUserCurrencyHaves.do', options)
}

// 虚拟币出售
export function sellCurrency (options) {
  return post('/api/currency/sellCurrency.do', options)
}

// 新股认缴
export function xinguTransfer(options) {
    return postParams('/api/xingu/transfer.do', options);
}
