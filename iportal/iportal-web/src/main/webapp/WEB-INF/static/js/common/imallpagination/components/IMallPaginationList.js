import React, {Component, PropTypes} from "react";
import IMallPageButton from "./IMallPageButton";
import IMallConst from "./../constants/IMallConst";

class IMallPaginationList extends Component {

  constructor(props) {
    super(props);
  }

  changePage(page) {
    const {
      pageStartIndex,
      prePage,
      currPage,
      nextPage,
      lastPage,
      firstPage,
      sizePerPage
    } = this.props;

    if (page === prePage) {
      page = (currPage - 1) < pageStartIndex ? pageStartIndex : currPage - 1;
    } else if (page === nextPage) {
      page = (currPage + 1) > this.lastPage ? this.lastPage : currPage + 1;
    } else if (page === lastPage) {
      page = this.lastPage;
    } else if (page === firstPage) {
      page = pageStartIndex;
    } else {
      page = parseInt(page, 10);
    }

    if (page !== currPage) {
      this.props.changePage(page, sizePerPage);
    }
  }

  changeSizePerPage(e) {
    e.preventDefault();

    const selectSize = parseInt(e.currentTarget.getAttribute('data-page'), 10);
    let { currPage } = this.props;
    if (selectSize !== this.props.sizePerPage) {
      this.totalPages = Math.ceil(this.props.dataSize / selectSize);
      this.lastPage = this.props.pageStartIndex + this.totalPages - 1;
      if (currPage > this.lastPage) currPage = this.lastPage;
      this.props.changePage(currPage, selectSize);
      if (this.props.onSizePerPageList) {
        this.props.onSizePerPageList(selectSize);
      }
    }
  }



  render() {
    const {
      currPage,
      dataSize,
      sizePerPage,
      sizePerPageList,
      paginationShowsTotal,
      pageStartIndex,
      hideSizePerPage,
      isWindow
    } = this.props;
    let sizePerPageText = '';
    this.totalPages = Math.ceil(dataSize / sizePerPage);
    this.lastPage = this.props.pageStartIndex + this.totalPages - 1;
    const pageBtns = this.makePage();
    const pageListStyle = {
      float: 'right',
      marginTop: '0px'
    };

    const sizePerPageOptions = sizePerPageList.map((_sizePerPage) => {
      const pageText = _sizePerPage.text || _sizePerPage;
      const pageNum = _sizePerPage.value || _sizePerPage;
      if (sizePerPage === pageNum) sizePerPageText = pageText;
      return (
        <li key={ pageText } role='presentation'>
          <a role='menuitem'
            tabIndex='-1' href='#'
            data-page={ pageNum }
            onClick={ this.changeSizePerPage.bind(this) }>{ pageText }</a>
        </li>
      );
    });

    const offset = Math.abs(IMallConst.IMALL_PAGE_START_INDEX - pageStartIndex);
    let start = ((currPage - pageStartIndex) * sizePerPage);
    start = dataSize === 0 ? 0 : start + 1;
    let to = Math.min((sizePerPage * (currPage + offset) - 1), dataSize);
    if (to >= dataSize) to--;
    let total = paginationShowsTotal ? <span>Showing rows { start } to&nbsp;{ to + 1 } of&nbsp;{ dataSize }</span> : null;

    if (typeof paginationShowsTotal === 'function') {
      total = paginationShowsTotal(start, to + 1, dataSize);
    }
    if(!this.totalPages||this.totalPages==1){
      return (<div></div>)
    }
    if(isWindow){
      return (
            <div id="infoPage">
              <ul >
                { pageBtns }
                <li><div id="page-skip">&nbsp;&nbsp;共{this.totalPages}页&nbsp;&nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;<input id="inputPage" />&nbsp;页<button type="button" href="javascript:;" onClick={()=>this.goToPage(this.totalPages)} className="goToPage">确定</button><div></div></div></li>
              </ul>
            </div>
      );
    }
    return (
     <div className='page-footer'>
      <div id="infoPage">
        <ul >
          { pageBtns }
          <li><div id="page-skip">&nbsp;&nbsp;共{this.totalPages}页&nbsp;&nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;<input id="inputPage" />&nbsp;页<button type="button" href="javascript:;" onClick={()=>this.goToPage(this.totalPages)} className="goToPage">确定</button><div></div></div></li>
        </ul>
      </div>
    </div>

    );
  }

  goToPage(){
    const { sizePerPage} = this.props;
    let currentPage = $('#inputPage').val();
    if(currentPage<1){
      currentPage=1;
      $('#inputPage').val(1);
    }else if(currentPage>this.totalPages){
      currentPage=this.totalPages;
      $('#inputPage').val(currentPage);
    }
    this.props.changePage(currentPage,sizePerPage);
  }



  makePage() {
    const pages = this.getPages();
    return pages.map(function(page,index) {
      const isActive = page === this.props.currPage;
      let disabled = false;
      let hidden = false;
      let isUpPage = false;
      let isDownPage = false;
      if(index == 0){
        isUpPage = true;
      }
      if(index ==pages.length-1){
        isDownPage = true;
      }
      if (this.props.currPage === this.props.pageStartIndex && (page === this.props.firstPage || page === this.props.prePage)) {
        disabled = true;
        hidden = true;
      }
      if (this.props.currPage === this.lastPage && (page === this.props.nextPage || page === this.props.lastPage)) {
        disabled = true;
        hidden = true;
      }

      /**/
      if(index >1 && index<this.props.currPage-2){
        if(index==2){
          return (<li>
            <span className="pn-break">...</span>
          </li>)
        }
        return (<span/>)
      }

      if(index - this.props.currPage> 2 && index < pages.length-2){
        if(index == pages.length - 3){
          return (<li>
            <span className="pn-break">...</span>
          </li>)
        }
        return (<span/>)
      }

      return (
        <IMallPageButton key={ page }
          changePage={ this.changePage.bind(this) }
          active={ isActive }
          disable={ disabled }
          hidden={ hidden }
          isUpPage={ isUpPage }
          isDownPage={ isDownPage }>
          { page }
        </IMallPageButton>
      );
    }, this);
  }

  getPages() {
    let pages;
    let endPage = this.totalPages;
    if (endPage <= 0) return [];
    let startPage = Math.max(
      this.props.currPage - Math.floor(this.props.paginationSize / 2),
      this.props.pageStartIndex
    );
    endPage = startPage + this.props.paginationSize - 1;

    if (endPage > this.lastPage) {
      endPage = this.lastPage;
      startPage = endPage - this.props.paginationSize + 1;
    }

    if (startPage !== this.props.pageStartIndex && this.totalPages > this.props.paginationSize) {
      pages = [ this.props.firstPage, this.props.prePage ];
    } else if (this.totalPages > 1) {
      pages = [ this.props.prePage ];
    } else {
      pages = [];
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i >= this.props.pageStartIndex) pages.push(i);
    }

    if (endPage <= this.lastPage && this.props.currPage!=1) {
      pages.push(this.props.nextPage);
    } else if (endPage === this.lastPage && this.props.currPage !== this.lastPage) {
      pages.push(this.props.nextPage);
    }

    return pages;
  }
}
IMallPaginationList.propTypes = {
  currPage: PropTypes.number,
  sizePerPage: PropTypes.number,
  dataSize: PropTypes.number,
  changePage: PropTypes.func,
  sizePerPageList: PropTypes.array,
  paginationShowsTotal: PropTypes.oneOfType([ PropTypes.bool, PropTypes.func ]),
  paginationSize: PropTypes.number,
  remote: PropTypes.bool,
  onSizePerPageList: PropTypes.func,
  prePage: PropTypes.string,
  pageStartIndex: PropTypes.number,
  hideSizePerPage: PropTypes.bool
};

IMallPaginationList.defaultProps = {
  sizePerPage: IMallConst.IMALL_SIZE_PER_PAGE,
  pageStartIndex: IMallConst.IMALL_PAGE_START_INDEX
};

export default IMallPaginationList;
