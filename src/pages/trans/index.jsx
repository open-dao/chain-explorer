import React,{Component} from 'react';
import {getTransList} from '@/redux/actions/Trans';
import {connect} from 'react-redux';
import {Table,Spin,Button,Modal,Menu, Dropdown, Icon, Input,Col,Row} from 'antd';
import locale from '@/components/locale';
import Container from '@/components/Container';
import currencys from '@/components/token/index.js';
import {Link} from 'react-router-dom';
import BlockService from '../../service/BlockService'
import ViewtransService from '../../service/ViewtransService'
import './index.css';

locale.init();
class Trans extends Component {
    constructor(props) {
        super(props);
        this.transHashList =[];
        this.othertransColumns = [{
            title:locale.get('blockNumber'),
            dataIndex:'blockNumber',
            key:'blockNumber'
        },{
            title:locale.get('from'),
            dataIndex:'from',
            key:'from'
        },{
            title:locale.get('hash'),
            dataIndex:'hash',
            key:'hash'
        },{
            title:locale.get('data'),
            dataIndex:'data',
            key:'data',
            width:50,
            render:(text,item)=><Button><Link to={{pathname:'./viewTrans',state:item.hash}}>{locale.get('view')}</Link></Button>
        }];
        this.transColumns = [{
            title:locale.get('name'),
            dataIndex:'name',
            width:100,
            key:'name'
        },{
            title:locale.get('id'),
            dataIndex:'blocknumber',
            width:100,
            key:'id'
        },{
            title:locale.get('hash'),
            dataIndex:'transactionhash',
            key:'hash'
        },{
            title:locale.get('sender'),
            dataIndex:'fromaddress',
            key:'sender'
        },{
            title:locale.get('recipient'),
            dataIndex:'toaddress',
            key:'recipient'
        },{
            title:locale.get('amount'),
            dataIndex:'amount',
            key:'amount'
        },{
            title:locale.get('date'),
            dataIndex:'timestamp',
            key:'date',
        },{
            title:locale.get('data'),
            dataIndex:'data',
            key:'data',
            width:50,
            render:(text,item)=><Button><Link to={{pathname:'./viewTrans',state:item.transactionhash}}>{locale.get('view')}</Link></Button>
        }];
        this.state={
            pagination:{
                pageSize:10,
                total:0,
                pageTotal:0,
                current:1,
                bookmark:[],
                next:true,
                prev:false,
            },
            visible:false,
            transData:{},
            currencyKind:'LIS',//货币的种类
            transactionHash:"",//交易的哈希或者账户地址
            firstVisit:true,//第一次进入该页面
            dataTotal:0, //获取总的数据条数
            tem_dataList:[],//获取最近交易的数据数组
            loopfinish:true,//循环post是否结束
            isChangeToken:false,//是否是搜索状态
        };
        this.handleOnTableChange = this.handleOnTableChange.bind(this);
        this.handleNextPage = this.handleNextPage.bind(this);
        this.handlePrevPage = this.handlePrevPage.bind(this);
        this.fetch = this.fetch.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleOK = this.handleOK.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.chooseDifferentCurrency = this.chooseDifferentCurrency.bind(this);
        this.search = this.search.bind(this);
    }
    componentDidMount() {
        let that = this;
        // 获取最新的block的id
        BlockService.getCurrentBlockId().then((ret)=>{
            let _that = that;
            let tem_currentBlockId = ret.data.data.msg.head.currentBlock;
             console.log(tem_currentBlockId);
            for(let i = tem_currentBlockId;i > tem_currentBlockId-4000;i-=30) {
                let maxId =i,minId= i-29;
                 console.log(maxId+'--'+minId);// 从最新的blockId开始向后搜索1000个数据
                BlockService.getCurrentTransInfo(maxId, minId).then((ret) => {
                    let _that_ = _that;
                    let transList = ret.data.data.msg.detail;
                    for(let j=0;j<transList.length;j++){
                        if(transList[j].transactions.length > 0){
                            //如果有交易的信息我们就根据交易的哈希去获取交易信息
                            for(let k=0;k<transList[j].transactions.length;k++){
                                let tem_hash = transList[j].transactions[k]
                                ViewtransService.getViewtransDetail(tem_hash).then((ret)=> {
                                    let tem_obj = ret.data.data.msg.head;
                                    // 把交易的信息保存下来
                                    _that_.setState({
                                        tem_dataList:[..._that_.state.tem_dataList,tem_obj],
                                        firstVisit:false
                                    })
                                })
                            }
                        }
                    }
                })
            }
        });
        setTimeout(()=> {
            if(this.state.firstVisit === true){
                this.setState({firstVisit: false})
            }
        },5000)
    }
    handleOnTableChange(cur){
        if(cur<1 || cur>this.state.pagination.pageTotal ){
            return;
        }
        this.state.pagination.current = cur;
        this.state.pagination.prev = this.state.pagination.current>1;
        this.state.pagination.next = this.state.pagination.pageTotal>this.state.pagination.current;
        const trans = this.props.Trans||{};
        const transTotal = trans.result.data?trans.result.data.msg.head.total:0;
        let param = transTotal-(this.state.pagination.pageTotal-1)*10;
        //查询到最后一页显示的数目是总数除以10的余数
        cur ==this.state.pagination.pageTotal?this.fetch(param):this.fetch();
    }
    handleNextPage(){
        this.handleOnTableChange(this.state.pagination.current+1)
    }
    handlePrevPage(){
        this.handleOnTableChange(this.state.pagination.current-1);
    }
    fetch(){
        if(arguments.length==0){
            this.props.getTransList(this.state.pagination.pageSize,this.state.pagination.current-1,this.state.currencyKind,this.state.transactionHash.trim());
        }else{
            this.props.getTransList(arguments[0],this.state.pagination.current-1,this.state.currencyKind,this.state.transactionHash);
        }
    }
    handleShow(item){
        let data = {};
        data.inputs = JSON.stringify(item.data.inputs);
        data.outputs = JSON.stringify(item.data.outputs);
        this.setState({visible:true,transData:data});
    }
    handleOK(){
        this.setState({visible:false});
    }
    handleCancel(){
        this.setState({visible:false})
    }
    chooseDifferentCurrency({key}){
        this.setState({currencyKind:key})
    }
    search(){
        console.log(this.state.tem_dataList);
        this.state.pagination.current= 1;
        this.state.pagination.pageSize= 10;
        this.state.firstVisit?
        this.setState({firstVisit:false,loopfinish:false},()=>{this.fetch()}):
        this.setState({loopfinish:false},()=>{this.fetch()});
    }
    render() {
        const currencysList = currencys.map((item)=><Menu.Item key={item}>{item}</Menu.Item>)
        const menu = (<Menu onClick={this.chooseDifferentCurrency}>{currencysList}</Menu>);
        const trans = this.props.Trans||{};
        const transList = trans.result.data?trans.result.data.msg.detail:null;
        const transTotal = trans.result.data?trans.result.data.msg.head.total:0;
        if(transList!=null&&transList.length>=0){
            this.state.pagination.bookmark=transList; 
        }
        // console.log(this.state.pagination.bookmark);
        if(transTotal>0){
            this.state.pagination.pageTotal=Math.ceil(transTotal/this.state.pagination.pageSize);
        }
        return (
            <Container>
                <Row className="search">
                    <Col span={2}>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a className="ant-dropdown-link" href="#">{this.state.currencyKind}<Icon type="down" /></a>
                        </Dropdown>
                    </Col>
                    <Col span={10}>
                        <Input size="small" 
                               placeholder={locale.get("inputToTransactionHashOrAccountAddress")} 
                               className="search-input" 
                               value={this.state.transactionHash}
                               onChange={(e)=>{this.setState({transactionHash:e.target.value})}}
                        />
                    </Col>
                    <Col span={1}></Col>
                    <Col span={11}><Button size='small' type="primary" icon="search" onClick={this.search}>{locale.get("search")}</Button></Col>
                </Row>
                <div style={{height:20}}></div>
                    {
                        //this.state.firstVisit?null:
                        //trans.errorMsg?trans.errorMsg:
                        // this.state.loopfinish?null:
                        <Spin tip={locale.get("dataLoading")} spinning={this.state.firstVisit}>
                            {
                                this.state.transactionHash == ''?
                                <div>
                                    <h3>{locale.get('transInfo')}</h3>
                                    <Table
                                    dataSource={this.state.tem_dataList}
                                    columns={this.othertransColumns}
                                    bordered
                                    rowKey="hash"
                                    pagination={false}
                                    />
                                </div>
                                :
                                <div>
                                     <Table
                                        dataSource={this.state.pagination.bookmark}
                                        columns={this.transColumns}
                                        bordered
                                        rowKey="transactionhash"
                                        pagination={false}
                                     />
                                    <ul className="ant-pagination ant-table-pagination">
                                        <li title="Previous Page" tabIndex={0} className={this.state.pagination.prev==true?"ant-pagination-enable ant-pagination-item":"ant-pagination-disabled ant-pagination-item"} >
                                            <a className="ant-pagination-item-link" onClick={this.handlePrevPage}>上一页</a>
                                        </li>
                                        <li title="2/5" className="ant-pagination-item" style={{border:0}}>
                                            {this.state.pagination.current}<span>／</span>{this.state.pagination.pageTotal}
                                        </li>
                                        <li title="Next Page" tabIndex={0} className={this.state.pagination.next==true?"ant-pagination-enable ant-pagination-item":"ant-pagination-disabled ant-pagination-item"} >
                                            <a className="ant-pagination-item-link" onClick={this.handleNextPage}>下一页</a>
                                        </li>
                                    </ul>
                                </div>
                               
                            }
                            
                            <Modal
                                title={locale.get('transData')}
                                visible={this.state.visible}
                                onOk={this.handleOK}
                                onCancel={this.handleCancel}
                                footer={null}
                            >
                                <div style={{marginTop:-10}}>
                                    <h4>{locale.get('input')}</h4>
                                    <div className='data-box'>{this.state.transData.inputs}</div>
                                    <h4 style={{marginTop:15}}>{locale.get('output')}</h4>
                                    <div className='data-box'>{this.state.transData.outputs}</div>
                                </div>
                            </Modal>
                        </Spin>
                    }
            </Container>
        );
    }
}
const mapStateToProps = (state)=>{
    return {
        Trans:state.Trans
    }
}

export default connect(mapStateToProps,{getTransList})(Trans);
