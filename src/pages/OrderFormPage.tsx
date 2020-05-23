// import 'date-fns';
import React from 'react';
import { Link, match } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import SaveIcon from '@material-ui/icons/Save';
import Divider from '@material-ui/core/Divider';
import PageBase from '../components/PageBase';
import Skeleton from '@material-ui/lab/Skeleton';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ContentCreate from '@material-ui/icons/Create';
import ActionDelete from '@material-ui/icons/Delete';
import { getAction } from '../actions/order';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import { grey } from '@material-ui/core/colors';
import { thunkApiCall, thunkApiQCall } from '../services/thunks';
import { Customer, User, Category, Product, Order } from '../types';
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Select,
  Dialog,
  MenuItem,
  DialogTitle,
  DialogActions,
  DialogContent,
  LinearProgress,
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';

import { ApiAction, GET_ORDER, UPDATE_ORDER, CREATE_ORDER, EDIT_ORDER, ApiQActions } from '../store/types';
import Alert from '@material-ui/lab/Alert';
import SkeletonForm from '../components/SkeletonForm';

const grey400 = grey['400'];

const styles = {
  toggleDiv: {
    maxWidth: 300,
    marginTop: 40,
    marginBottom: 5,
  },
  toggleLabel: {
    color: grey400,
    fontWeight: 100,
  },
  buttons: {
    marginTop: 30,
    float: 'right' as TODO,
  },
  saveButton: {
    marginLeft: 5,
  },
  card: {
    width: 120,
    maxWidth: 300,
    marginTop: 40,
    marginBottom: 5,
  },
  container: {
    marginTop: '2em',
  },
  cell: {
    padding: '1em',
  },
  fullWidth: {
    width: '100%',
  },
  productList: {
    color: 'navy' as TODO,
    paddingTop: 20,
    fontWeight: 'bold' as TODO,
  },
  textField: {
    marginLeft: 4, // theme.spacing(1),
    marginRight: 4, //theme.spacing(1),
    width: '100%',
  },
  dialog: {
    width: 400,
    maxWidth: 'none',
  },
};

interface OrderFormProps {
  match: match;
  order: Order;
  getOrder: typeof thunkApiQCall;
  saveOrder: typeof thunkApiCall;
  searchOrder: typeof thunkApiCall;
  isFetching: boolean;
  updated: boolean;
  newOrder: typeof thunkApiCall;
  updateOrder: typeof thunkApiCall;
  getProductList: typeof thunkApiCall;
  addOrder: typeof thunkApiCall;
  categoryList: Category[];
  productList: Product[];
  getAllOrders: typeof thunkApiCall;
  getCategoryList: typeof thunkApiCall;
  errorMessage?: string;
}

interface OrderFormState {
  open: boolean;
  order: Order;
  snackbarOpen: boolean;
  autoHideDuration: number;
  productId: number;
  dialogText: string; //'Are you sure to do this?',
  productList: Product[];
  product: Product;
}

class OrderFormPage extends React.Component<OrderFormProps, OrderFormState> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.notifyFormError = this.notifyFormError.bind(this);
    this.onSnackBarClose = this.onSnackBarClose.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onAddProduct = this.onAddProduct.bind(this);
    this.onSelectProduct = this.onSelectProduct.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  state = {
    // isFetching: true,
    open: false,
    order: {} as Order,
    snackbarOpen: false,
    autoHideDuration: 2000,
    productId: null,
    productList: [],
    dialogText: 'Are you sure to do this?',
    product: {} as Product,
  };

  componentDidMount() {
    console.log('componentDidMount ', this.props);
    // @ts-ignore
    const orderId = this.props.match.params?.id;
    let action: ApiQActions;
    if (orderId) {
      action = getAction(EDIT_ORDER, orderId) as ApiQActions; //  Object.assign({}, this.getAction);
      this.props.getOrder(action);
    }
  }

  notifyFormError(data) {
    console.error('Form error:', data);
  }

  handleClick(event, action) {
    event.preventDefault();
    console.log(event);
    if (action && action === 'AddProduct') {
      // this.setState({ open: true });
    } else {
      // if (this.state.order.id) this.props.updateOrder(this.state.order);
      // else this.props.addOrder(this.state.order);
    }
  }

  onSnackBarClose() {
    this.setState({
      snackbarOpen: false,
    });
  }

  handleChange(event, date) {
    const field = event ? event.target.name : null;
    const { order } = this.state;

    if (order) {
      if (typeof date === 'object') {
        let _order = Object.assign({}, order);
        order.shippedDate = date.toLocaleDateString();
        this.setState({ order: order });
      } else if (event && event.target && field) {
        let _order = Object.assign({}, order);
        _order[field] = event.target.value;
        this.setState({ order: _order });
      }
    }
  }

  /* eslint-disable */
  componentDidUpdate(prevProps) {
    // reset page if items array has changed
    if (this.props.order !== prevProps.order) {
      this.setState({ order: this.props.order });
      // const page = 1;
    }
    if (this.props.productList !== prevProps.productList) {
      this.setState({ productList: this.props.productList });
    }

    if (this.props.updated !== prevProps.updated && this.props.updated === true) {
      this.setState({ snackbarOpen: true });
    }
  }

  removeProduct(product) {
    const { order } = this.state;
    if (order && order.products && order.products.length) {
      this.state.order.products.splice(this.state.order.products.indexOf(product), 1);
      this.setState({ order: this.state.order });
    }
  }

  onAddProduct() {
    const { order, product } = this.state;
    // if (order && order.products && order.products.length) {
    // this.state.order.products.splice(this.state.order.products.indexOf(product), 1);
    if (!order.products) {
      order.products = [];
    }
    if (product && product.id) {
      order.products.push(product);
      this.setState({ order: this.state.order, product: {} as Product });
    }
  }

  handleCancel() {
    this.setState({ open: false });
  }

  addProduct() {
    this.setState({ open: true });
  }

  handleOk() {
    const { order } = this.state;

    order.products = order.products || [];
    // order.products.push(this.state.product);
    this.setState({ open: false });
    this.setState({ order: this.state.order });
    // this.enableButton();
  }

  onDelete(id) {
    if (id) {
      this.handleOpen(id);
    }
  }

  handleOpen(id) {
    this.setState({ dialogText: 'Are you sure to delete this data?' });
    this.setState({ open: true });
    this.setState({ productId: id });
  }

  handleCategoryChange(event, index, values) {
    // this.props.getProductList({
    //   categoryId: this.props.categoryList[values].id,
    // });
  }

  handleProductChange(event, index, values) {
    // this.setState({ product: this.props.productList[values] });
  }

  onSelectProduct(event: React.ChangeEvent<{ value: TODO }>) {
    const productId = event.target.value;

    console.log(productId);
    this.setState({ product: this.props.productList[productId] });
  }

  onSave(values: TODO) {
    console.log(this.state.order);

    const order = { ...this.state.order, ...values };
    console.log(order);
    let action: ApiAction;
    if (order.id > 0) {
      action = getAction(UPDATE_ORDER, null, order) as ApiAction;
    } else {
      action = getAction(CREATE_ORDER, null, order) as ApiAction;
    }
    this.props.saveOrder(action);
  }

  render() {
    const { isFetching, categoryList, productList } = this.props;
    const { order } = this.state;

    return (
      <PageBase title="Order" navigation="Application / Order ">
        {isFetching ? (
          <div>
            <SkeletonForm />
          </div>
        ) : (
          <Formik
            initialValues={{
              ...order,
            }}
            validate={values => {
              const errors: Partial<Order & User> = {};
              // if (!values.firstname) {
              //   errors.firstname = "Required";
              // }
              // if (!values.email) {
              //   errors.email = "Required";
              // } else if (
              //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
              // ) {
              //   errors.email = "Invalid email address";
              // }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              this.onSave(values);
              setTimeout(() => {
                setSubmitting(false);
                console.log(JSON.stringify(values, null, 2));
              }, 500);
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <Grid container style={styles.container} spacing={3}>
                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      component={TextField}
                      placeholder="Customer"
                      label="Customer"
                      name="customer.firstname"
                      disabled
                      fullWidth={true}
                      required
                    />
                  </Grid>
                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      component={TextField}
                      placeholder="Reference"
                      label="Reference"
                      name="reference"
                      onChange={this.handleChange}
                      fullWidth={true}
                      required
                    />
                  </Grid>

                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      component={TextField}
                      placeholder="Amount"
                      label="Amount"
                      fullWidth={true}
                      name="price"
                      onChange={this.handleChange}
                      required
                    />
                  </Grid>

                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      component={TextField}
                      placeholder="Quantity"
                      label="Quantity"
                      fullWidth={true}
                      type="number"
                      name="quantity"
                      required
                    />
                  </Grid>
                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      component={TextField}
                      id="orderDate"
                      placeholder="Order Date"
                      label="Order Date"
                      type="date"
                      name="orderDate"
                      // defaultValue="2010-"
                      style={styles.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      component={TextField}
                      id="shippedDate"
                      placeholder="Shipped Date"
                      label="Shipped Date"
                      type="date"
                      name="shippedDate"
                      // defaultValue="2010-"
                      style={styles.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      component={TextField}
                      placeholder="Address"
                      label="Address"
                      name="shipAddress.address"
                      onChange={this.handleChange}
                      fullWidth={true}
                      value={order.shipAddress && order.shipAddress.address ? order.shipAddress.address : ''}
                      required
                    />
                  </Grid>

                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      component={TextField}
                      placeholder="City"
                      label="City"
                      name="city"
                      onChange={this.handleChange}
                      fullWidth={true}
                      value={order.shipAddress && order.shipAddress.city ? order.shipAddress.city : ''}
                      required
                    />
                  </Grid>

                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      component={TextField}
                      placeholder="Country"
                      label="Country"
                      name="country"
                      onChange={this.handleChange}
                      fullWidth={true}
                      value={order.shipAddress && order.shipAddress.country ? order.shipAddress.country : ''}
                      required
                    />
                  </Grid>

                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      component={TextField}
                      placeholder="Zip Code"
                      label="Zip Code"
                      name="zipcode"
                      onChange={this.handleChange}
                      fullWidth={true}
                      value={order.shipAddress && order.shipAddress.zipcode ? order.shipAddress.zipcode : ''}
                      required
                    />
                  </Grid>
                </Grid>

                <p style={styles.productList}>Product List: </p>
                <Divider />

                {order.products && (
                  <div>
                    <List dense={false}>
                      {order.products.map((product, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={product.name} secondary={`Price: $ ${product.unitPrice}`} />
                          <IconButton onClick={() => this.removeProduct(product)}>
                            <ActionDelete />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                )}

                <Divider />
                {isSubmitting && <LinearProgress />}
                <div style={styles.buttons}>
                  <Link to="/orders">
                    <Button variant="contained">
                      {/* onClick={this.handleGoBack}> */}
                      <ArrowBackIosIcon /> Back{' '}
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    style={styles.saveButton}
                    // type="button"
                    onClick={submitForm}
                    color="primary"
                    disabled={isSubmitting}
                  >
                    <SaveIcon /> Save
                  </Button>
                  <Button variant="contained" style={styles.saveButton} onClick={this.addProduct} color="secondary">
                    <ContentCreate /> Add
                  </Button>
                </div>
                {/* {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} */}

                <React.Fragment>
                  <Dialog title="Add Product" open={this.state.open} maxWidth="xs" fullWidth>
                    <DialogTitle key="alert-dialog-title">{'Alert'}</DialogTitle>
                    <DialogContent key="alert-dialog-content" style={{ display: 'inline-flex' }}>
                      <Select style={{ width: 200, marginRight: 10 }} label="Categories" name="categoryId">
                        {categoryList.map((category, index) => (
                          <MenuItem key={index} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>

                      <Select style={{ width: 200 }} label="Products" name="categoryId" onChange={this.onSelectProduct}>
                        {productList.map((product, index) => (
                          <MenuItem key={index} value={index}>
                            {product.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </DialogContent>
                    <DialogActions key="alert-dialog-action">
                      <Button variant="contained" onClick={this.handleCancel} color="primary">
                        Cancel
                      </Button>
                      <Button variant="contained" onClick={this.onAddProduct} color="primary">
                        Ok
                      </Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>
                <Snackbar open={this.state.snackbarOpen} autoHideDuration={this.state.autoHideDuration} onClose={this.onSnackBarClose}>
                  <Alert onClose={this.onSnackBarClose} severity="success">
                    The operation completed successfully !
                  </Alert>
                </Snackbar>
              </Form>
            )}
          </Formik>
        )}
      </PageBase>
    );
  }
}

function mapStateToProps(state) {
  const { customerList } = state.customer;
  const { order, isFetching, updateSuccess, addSuccess, isAuthenticated, user, productList, categoryList } = state.order;

  return {
    order: order || {},
    isFetching,
    customerList,
    categoryList,
    productList,
    addSuccess,
    updateSuccess,
    isAuthenticated,
    user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    newOrder: action => dispatch(thunkApiCall(action)),
    getOrder: action => dispatch(thunkApiQCall(action)),
    updateOrder: action => dispatch(thunkApiCall(action)),
    addOrder: action => dispatch(thunkApiCall(action)),
    saveOrder: action => dispatch(thunkApiCall(action)),
    getCategoryList: action => dispatch(thunkApiCall(action)),
    getProductList: action => dispatch(thunkApiCall(action)),
    getAllCustomers: action => dispatch(thunkApiCall(action)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderFormPage);
