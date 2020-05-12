import React, { PropTypes } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "@material-ui/core/Table";
import Fab from "@material-ui/core/Fab";
import ContentCreate from '@material-ui/icons/Create';
import ActionDelete from '@material-ui/icons/Delete';
import ContentAdd from '@material-ui/icons/Add';
import Search from '@material-ui/icons/Search';
const pink500 = pink['500'];
const grey200 = grey['200'];
const grey500 = grey['500'];
const green400 = green['400'];
const teal500 = teal['500'];
const white = common.white;
import PageBase from "../components/PageBase";
// import Data from '../data';
import Pagination from "../components/Pagination";
import { connect } from "react-redux";
import { loadProducts, deleteProduct } from "../actions/product";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";

import { pink, grey, green, teal, common } from '@material-ui/core/colors';

class ProductListPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      searchOpen: false,
      snackbarOpen: false,
      autoHideDuration: 1500,
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: false,
      pageOfItems: [],
      productId: null,
      dialogText: "Are you sure to do this?",
      search: {
        product: ""
      }
    };

    this.onChangePage = this.onChangePage.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.handleToggle = this.handleToggle.bind(this);
    this.handleSearchFilter = this.handleSearchFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleErrorMessage = this.handleErrorMessage.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);

    if (this.props.productList || this.props.productList.length < 1)
      props.getAllProducts(this.state.search);
  }

  UNSAFE_componentWillMount() { }

  /* eslint-disable */
  componentDidUpdate(prevProps, prevState) {
    // reset page if items array has changed
    if (this.props.productList !== prevProps.productList) {
      //this.setPage(this.props.initialPage);
      this.onChangePage(this.props.productList.slice(0, 10));
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.errorMessage && !nextProps.deleteSuccess) {
      this.setState({ snackbarOpen: true });
    }

    if (
      !this.props.deleteSuccess &&
      nextProps.deleteSuccess &&
      !nextProps.errorMessage &&
      !nextProps.isFetching
    ) {
      this.props.getAllProducts();
    }
  }

  onChangePage(pageOfItems) {
    if (
      !this.props.isFetching &&
      this.state.pageOfItems &&
      this.props.productList
    )
      this.setState({ pageOfItems: pageOfItems });
  }

  onDelete(id) {
    if (id) {
      this.handleOpen(id);
    }
  }

  handleToggle() {
    this.setState({ searchOpen: !this.state.searchOpen });
  }

  handleSearch() {
    this.setState({ searchOpen: !this.state.searchOpen });
    this.props.getAllProducts(this.state.search);
  }

  handleOpen(id) {
    this.setState({ dialogText: "Are you sure to delete this data?" });
    this.setState({ open: true });
    this.setState({ productId: id });
  }

  handleClose(isConfirmed) {
    this.setState({ open: false });

    if (isConfirmed && this.state.productId) {
      this.props.deleteProduct(this.state.productId);
      this.setState({ productId: null });
    }
  }

  handleSearch() {
    this.setState({ searchOpen: !this.state.searchOpen });
    this.props.getAllProducts(this.state.search);
  }

  handleSearchFilter(event) {
    const field = event.target.name;

    if (event && event.target && field) {
      const search = Object.assign({}, this.state.search);
      search[field] = event.target.value;

      this.setState({ search: search });
    }
  }

  handleErrorMessage() {
    this.setState({
      snackbarOpen: true
    });
  }

  handleSnackBarClose() {
    this.setState({
      snackbarOpen: false
    });
  }

  render() {
    const { errorMessage, productList } = this.props;

    const styles = {
      fab: {
        // margin: 0,
        top: "auto",
        right: 20,
        bottom: 20,
        left: "auto",
        position: "fixed",
        marginRight: 20
      },
      fabSearch: {
        // margin: 0,
        top: "auto",
        right: 100,
        bottom: 20,
        left: "auto",
        position: "fixed",
        marginRight: 20,
        backgroundColor: "lightblue"
      },
      editButton: {
        paddingRight: 25
      },
      editButtonIcon: {
        fill: white
      },
      deleteButton: {
        fill: grey500
      },
      columns: {
        id: {
          width: "10%"
        },
        name: {
          width: "40%"
        },
        price: {
          width: "20%",
          textAlign: "right"
        },
        category: {
          width: "20%"
        },
        edit: {
          width: "20%"
        }
      },
      dialog: {
        width: "20%",
        maxWidth: "none"
      },
      drawer: {
        backgroundColor: "lightgrey"
      }
    };

    const actions = [
      <Button
        label="Cancel"
        primary={true}
        value={false}
        onTouchTap={() => this.handleClose(false)}
      />,
      <Button
        label="Confirm"
        primary={true}
        value={true}
        onTouchTap={() => this.handleClose(true)}
      />
    ];

    return (
      <PageBase
        title={"Products (" + productList.length + ")"}
        navigation="React CRM / Product"
      >
        <div>
          <Link to="/product">
            <Fab style={styles.fab} backgroundColor={pink500}>
              <ContentAdd />
            </Fab>
          </Link>
          <Fab
            style={styles.fabSearch}
            backgroundColor={teal500}
            onTouchTap={this.handleToggle}
          >
            <Search />
          </Fab>

          <Snackbar
            open={this.state.snackbarOpen}
            message={errorMessage ? errorMessage : ""}
            autoHideDuration={this.state.autoHideDuration}
            onRequestClose={this.handleSnackBarClose}
          />

          <Table
            fixedHeader={this.state.fixedHeader}
            fixedFooter={this.state.fixedFooter}
            selectable={this.state.selectable}
            multiSelectable={this.state.multiSelectable}
          >
            <TableHeader
              displaySelectAll={this.state.showCheckboxes}
              adjustForCheckbox={this.state.showCheckboxes}
              enableSelectAll={this.state.enableSelectAll}
            >
              <TableRow>
                <TableHeaderColumn style={styles.columns.name}>
                  Product
                </TableHeaderColumn>
                <TableHeaderColumn style={styles.columns.name}>
                  Category
                </TableHeaderColumn>
                <TableHeaderColumn style={styles.columns.price}>
                  Price
                </TableHeaderColumn>
                <TableHeaderColumn style={styles.columns.price}>
                  Quantity
                </TableHeaderColumn>
                <TableHeaderColumn style={styles.columns.edit}>
                  Edit
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={this.state.showCheckboxes}
              deselectOnClickaway={this.state.deselectOnClickaway}
              showRowHover={this.state.showRowHover}
              stripedRows={this.state.stripedRows}
            >
              {this.state.pageOfItems.map(item => (
                <TableRow key={item.id}>
                  <TableRowColumn style={styles.columns.name}>
                    {item.productName}
                  </TableRowColumn>
                  <TableRowColumn style={styles.columns.name}>
                    {item.category ? item.category.categoryName : ""}
                  </TableRowColumn>
                  <TableRowColumn style={styles.columns.price}>
                    AUD ${item.unitPrice}
                  </TableRowColumn>
                  <TableRowColumn style={styles.columns.price}>
                    {item.unitInStock}
                  </TableRowColumn>
                  <TableRowColumn style={styles.columns.edit}>
                    <Link className="button" to={"/product/" + item.id}>
                      <Fab
                        zDepth={0}
                        mini={true}
                        style={styles.editButton}
                        backgroundColor={green400}
                        iconStyle={styles.editButtonIcon}
                      >
                        <ContentCreate />
                      </Fab>
                    </Link>

                    <Fab
                      zDepth={0}
                      mini={true}
                      backgroundColor={grey200}
                      iconStyle={styles.deleteButton}
                      onTouchTap={() => this.onDelete(item.id)}
                    >
                      <ActionDelete />
                    </Fab>
                  </TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className={"row center-xs"}>
            <div className={"col-xs-6"}>
              <div className={"box"}>
                {productList && (
                  <Pagination
                    items={productList}
                    onChangePage={this.onChangePage}
                  />
                )}
              </div>
            </div>
          </div>
          <Dialog
            title="Confirm Dialog "
            actions={actions}
            modal={true}
            contentStyle={styles.dialog}
            open={this.state.open}
          >
            {this.state.dialogText}
          </Dialog>

          <Drawer
            width={300}
            openSecondary={true}
            open={this.state.searchOpen}
            containerStyle={styles.drawer}
          >
            {/*<AppBar title="AppBar" />*/}
            <Button variant="contained"
              label="Search"
              style={styles.saveButton}
              type="button"
              onClick={this.handleSearch}
              secondary={true}
            />

            <TextField
              hintText="Product"
              floatingLabelText="Product"
              name="product"
              fullWidth={true}
              value={this.state.search.product}
              onChange={this.handleSearchFilter}
            />
          </Drawer>
        </div>
      </PageBase>
    );
  }
}

ProductListPage.propTypes = {
  productList: PropTypes.array,
  getAllProducts: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired,
  deleteSuccess: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string
};

function mapStateToProps(state) {
  const { productReducer } = state;
  const {
    productList,
    deleteSuccess,
    isFetching,
    isAuthenticated,
    errorMessage,
    user
  } = productReducer;

  return {
    productList,
    isFetching,
    isAuthenticated,
    errorMessage,
    deleteSuccess,
    user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllProducts: filters => dispatch(loadProducts(filters)),
    deleteProduct: id => dispatch(deleteProduct(id))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListPage);
