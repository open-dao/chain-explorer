import React,{Component} from 'react'
import locale from '@/components/locale';
import Container from '@/components/Container';
import {Table,Spin} from 'antd';
import {Link} from 'react-router-dom';
import ViewtransService from '../../service/ViewtransService'
locale.init();

const columns = [{
  title:locale.get('data'),
  dataIndex:'key',
  width:150,
  key:'key',
},{
  title:locale.get('value'),
  dataIndex:'value',
  key:'value'
}];

export default class ViewTrans extends Component{
  constructor(props){
    super(props);
    this.state = {
      transHash:'',
      transList:[]
    }
    this.fetch = this.fetch.bind(this);
  }
  componentDidMount(){
    let tem_transHash= this.props.location.state;
    this.setState({transHash:tem_transHash},()=>{
      this.fetch();
    })
  }
  fetch(){
    var that =this;
    ViewtransService.getViewtransDetail(this.state.transHash).then((ret)=>{
      const tranObj =ret.data.data.msg.head;
      //ajax返回是个对象，我们要把对象中每个属性每个拿出来作为数组的元素
      let tem_transList =[];
      for(let key in tranObj){
        tem_transList.push({"key":locale.get(key),"value":tranObj[key]})
      }
      that.setState({transList:tem_transList});
    })
  }
  render(){
    return(
      <Container>
        <h3>{locale.get('transInfo')}</h3>
        <Spin tip={locale.get('dataLoading')} spinning={false}>
          <Table
              dataSource={this.state.transList}
              columns={columns}
              bordered
              rowKey="key"
              pagination={false}
          />
        </Spin>
      </Container>
    )
  }
}




