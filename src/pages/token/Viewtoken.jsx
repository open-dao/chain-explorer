import React,{Component} from 'react'
import locale from '@/components/locale';
import Container from '@/components/Container';
import {Table,Spin} from 'antd';

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

export default class ViewToken extends Component{
  constructor(props){
    super(props);
    this.state = {
      transHash:'',
      transList:[]
    }
  }
  componentDidMount(){
    let tem_transHash = this.props.location.state;
    console.log(tem_transHash);
    let tem_transList = [];
    for(let key in tem_transHash){
      tem_transList.push({"key":locale.get(key),"value":tem_transHash[key]})
    }
    this.setState({transList:tem_transList})
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