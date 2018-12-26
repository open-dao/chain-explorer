import React,{Component} from 'react';
import {getBlockList,getCurrentBlockId} from '@/redux/actions/Block';
import {connect} from 'react-redux';
import {Table,Spin,Button} from 'antd';
import locale from '@/components/locale';
import {Link} from 'react-router-dom';
import Container from '@/components/Container';
import TokenService from '../../service/TokenService'

locale.init();
const columns = [{
  title:locale.get('source'),
  dataIndex:'source',
  key:'source'
},{
  title:locale.get('address'),
  dataIndex:'address',
  key:'address'
},{
  title:locale.get('amount'),
  dataIndex:'amount',
  key:'amount',
},{
  title:locale.get('title'),
  dataIndex:'title',
  key:'title',
},{
  title:locale.get('createdt'),
  dataIndex:'createdt',
  key:'createdt',
},{
  title:locale.get('tokenname'),
  dataIndex:'tokenname',
  key:'tokenname',
},{
  title:locale.get('view'),
  dataIndex:'view',
  key:'view',
  render:(text,item)=><Button><Link to={{pathname:'./viewToken',state:item}}>{locale.get('view')}</Link></Button>
}];
class Token extends Component {
  constructor(props) {
    super(props);
    this.state={
      currentPage:1, // 当前页码
      tokenList: [],  // taken列表
      prev: false, // 是否有前一页
      next:true  // 是否有后一页
    };
    this.handleOnTableChange = this.handleOnTableChange.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.fetch = this.fetch.bind(this);
  }
  componentDidMount() {
    this.fetch()
  }
  fetch() {
    let tem_currentPage = this.state.currentPage - 1;
    let offset =tem_currentPage * 10;
    let rows = 10;
    let that = this;
    TokenService.getTokenList(offset,rows).then((ret)=> {
      let tem_list = ret.data?ret.data.response.tokens:[];
      that.setState({
        tokenList:tem_list
      })
    })
  }
  handleOnTableChange(){
    this.fetch(); 
  }
  handleNextPage(){
    this.setState({
      currentPage: this.state.currentPage + 1,
      prev: true
    },()=>{
      this.handleOnTableChange()
    })
  }
  handlePrevPage(){
    if(this.state.currentPage == 2){
      this.setState({
        currentPage: this.state.currentPage-1,
        prev: false
      },()=>{
        this.handleOnTableChange();
      })
    }else {
      this.setState({
        currentPage:this.state.currentPage-1,
      },()=>{
        this.handleOnTableChange();
      })
    }
  }
  render() {
    return (
      <Container>
          <Spin tip={locale.get("dataLoading")} spinning={false}>
              {
                  <Table
                      dataSource={this.state.tokenList}
                      columns={columns}
                      rowKey="Id"
                      bordered
                      onChange={this.handleOnTableChange}
                      pagination={false}
                  />
              }
              <ul className="ant-pagination ant-table-pagination">
                  <li title="Previous Page" tabIndex={0} className={this.state.prev==true?"ant-pagination-enable ant-pagination-item":"ant-pagination-disabled ant-pagination-item"} >
                      <a className="ant-pagination-item-link" onClick={this.handlePrevPage}>上一页</a>
                  </li>
                  <li title="current PageNumber" className="ant-pagination-item" style={{border:0}}>
                      {this.state.currentPage}
                  </li>
                  <li title="Next Page" tabIndex={0} className={this.state.next==true?"ant-pagination-enable ant-pagination-item":"ant-pagination-disabled ant-pagination-item"} >
                      <a className="ant-pagination-item-link" onClick={this.handleNextPage}>下一页</a>
                  </li>
              </ul>
          </Spin>
      </Container>
  );
  }
}
export default Token