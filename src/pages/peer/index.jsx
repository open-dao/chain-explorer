import React,{Component} from 'react';
import {getPeerList} from '@/redux/actions/Peer';
import {connect} from 'react-redux';
import {Table,Spin,Row,Col,Input,Button} from 'antd';
import locale from '@/components/locale';
import Container from '@/components/Container';
import currencys from '@/components/token/index.js';
import PeerService from '../../service/PeerService'

locale.init();

// const columns = [{
//     title:locale.get('ip'),
//     dataIndex:'url',
//     key:'url',
//     render:(text)=>{let regexp = /\d+\.\d+\.\d+\.\d+/;return <span>{text.match(regexp)}</span>}
// },{
//     title:locale.get('port'),
//     dataIndex:'url',
//     key:'port',
//     render:(text)=>{let regexp = /(?::)(\d+)/;return <span>{text.match(regexp)[1]}</span>}
// },{
//     title:locale.get('status'),
//     dataIndex:'status',
//     key:'status',
//     render:(text)=>{return <span>{text==1?"在线":"离线"}</span>}
// },{
//     title:locale.get('os'),
//     dataIndex:'os',
//     key:'os'
// },{
//     title:locale.get('height'),
//     dataIndex:'height',
//     key:'height'
// }];

const columns = [{
    title:locale.get('name'),
    dataIndex:'name',
    width:150,
    key:'name',
  },{
    title:locale.get('balance'),
    dataIndex:'balance',
    key:'balance'
  }];
class Peer extends Component {
    constructor(props) {
        super(props);
        this.state={
            pagination:{
                pageSize:12,
                defaultCurrent:1
            },
            address:'',
            peerList: [],
        };
        this.handleOnTableChange = this.handleOnTableChange.bind(this);
        this.fetch = this.fetch.bind(this);
        this.search = this.search.bind(this);
    }
    componentWillMount(){
        //this.fetch();
    }
    handleOnTableChange(pagination){
        let pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({pagination:pager});
        this.fetch();
    }
    search(){
        this.setState({peerList:[]},()=>{
            this.fetch();
        })
        
    }
    fetch(){
        //this.props.getPeerList(name,address);
        if(this.state.address == ''){alert(locale.get("searchAccountAddress"))}
        else{
            let tem_address = this.state.address;
            for(let i = 0;i<currencys.length;i++){
                PeerService.getPeerBalance(currencys[i],tem_address).then((res)=>{
                    if(res.data.data.head.ret== "0"){
                        let tem_balance=res.data.data.msg.head.balance==""?'暂无':res.data.data.msg.head.balance;
                        this.setState({peerList:[...this.state.peerList,{"name":currencys[i],"balance":tem_balance}]})
                    }else{
                        this.setState({peerList:[...this.state.peerList,{"name":currencys[i],"balance":locale.get("empty")}]})
                    }
                })
            }
        }
    }
    render() {
        // const peer = this.props.Peer||{};
        let showdata = this.state.peerList.length !== currencys.length;
        console.log(this.state.peerList);
        return (
            <Container>
                <Row className="search">
                    <Col span={10}>
                        <Input size="small" 
                               placeholder={locale.get("searchAccountAddress")} 
                               className="search-input" 
                               value={this.state.address}
                               onChange={(e)=>{this.setState({address:e.target.value.trim()})}}
                        />
                    </Col>
                    <Col span={1}></Col>
                    <Col span={13}><Button size='small' type="primary" icon="search" onClick={this.search}>{locale.get("search")}</Button></Col>
                </Row>
                <div style={{height:20}}></div>
                {
                    this.state.peerList.length ==0?null:
                    <Spin tip={locale.get("dataLoading")} spinning={showdata}>
                        <Table
                            dataSource={this.state.peerList}
                            columns={columns}
                            bordered
                            pagination={this.state.pagination}
                            rowKey="name"
                        />
                    </Spin>
                }
               
            </Container>
        );
    }
}
const mapStateToProps = (state)=>{
    return {
        Peer:state.Peer
    }
}

export default connect(mapStateToProps,{getPeerList})(Peer);
