import React from "react";
import { Link, match } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import SaveIcon from "@material-ui/icons/Save";
import Divider from "@material-ui/core/Divider";
import PageBase from "../components/PageBase";
import Skeleton from "@material-ui/lab/Skeleton";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { getAction } from "../actions/customer";

import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";

import { grey } from "@material-ui/core/colors";
import { thunkApiCall } from "../services/thunks";
import { Customer, User } from "../types";
import { LinearProgress, Grid } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import {
  GET_CUSTOMER,
  ApiAction,
  UPDATE_CUSTOMER,
  CREATE_CUSTOMER,
} from "../store/types";
import Alert from "@material-ui/lab/Alert";

const grey400 = grey["400"];

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
    float: "right" as TODO,
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
    marginTop: "2em",
  },
  cell: {
    padding: "1em",
  },
  fullWidth: {
    width: "100%",
  },
};

interface CustomerFormProps {
  // router: object;
  match: match;
  customer: Customer;
  getCustomer: typeof thunkApiCall;
  saveCustomer: typeof thunkApiCall;
  searchCustomer: typeof thunkApiCall;
  updateSuccess: boolean;
  addSuccess: boolean;
  errorMessage?: string;
  isFetching: boolean;
  updated: boolean;
}

interface CustomerFormState {
  customer: Customer;
  snackbarOpen: boolean;
  autoHideDuration: number;
}

// class CustomerFormPage extends React.Component {
class CustomerFormPage extends React.Component<
  CustomerFormProps,
  CustomerFormState
> {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    // this.enableButton = this.enableButton.bind(this);
    this.notifyFormError = this.notifyFormError.bind(this);
    this.onSnackBarClose = this.onSnackBarClose.bind(this);
  }

  state = {
    // isFetching: true,
    customer: {} as Customer,
    snackbarOpen: false,
    autoHideDuration: 2000,
  };

  componentDidMount() {
    console.log("componentDidMount ", this.props);
    // @ts-ignore
    const customerId = this.props.match.params?.id;
    let action: ApiAction;
    if (customerId) {
      action = getAction(GET_CUSTOMER, customerId); //  Object.assign({}, this.getAction);
      this.props.getCustomer(action);
    }
  }

  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate ", this.props);
    if (
      this.props.updated !== prevProps.updated &&
      this.props.updated === true
    ) {
      this.setState({ snackbarOpen: true });
    }
  }

  handleChange(event) {
    const field = event.target.name;

    if (event && event.target && field) {
      const customer = Object.assign({}, this.state.customer);
      customer[field] = event.target.value;
      this.setState({ customer: customer });
    }
  }

  notifyFormError(data) {
    console.error("Form error:", data);
  }

  handleClick(event) {
    event.preventDefault();
    // if (this.state.customer.id) this.props.updateCustomer(this.state.customer);
    // else this.props.addCustomer(this.state.customer);
  }

  onSnackBarClose() {
    this.setState({
      snackbarOpen: false,
    });
  }

  onSave(values: TODO) {
    console.log(this.state.customer);

    const customer = { ...this.state.customer, ...values };
    console.log(customer);
    let action: ApiAction;
    if (customer.id > 0) {
      action = getAction(UPDATE_CUSTOMER, null, customer);
    } else {
      action = getAction(CREATE_CUSTOMER, null, customer);
    }
    this.props.saveCustomer(action);
  }

  render() {
    const { errorMessage, isFetching, customer } = this.props;

    console.log(customer, isFetching);

    return (
      <PageBase title="Customer" navigation="Application / Customer ">
        {isFetching ? (
          <div>
            <Skeleton variant="text" />
            <Skeleton variant="rect" style={styles.fullWidth} height={300} />
          </div>
        ) : (
          <Formik
            initialValues={{
              ...customer,
            }}
            validate={(values) => {
              const errors: Partial<Customer & User> = {};
              if (!values.firstname) {
                errors.firstname = "Required";
              }
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
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
                      variant="outlined"
                      component={TextField}
                      placeholder="First Name"
                      label="First Name"
                      name="firstname"
                      fullWidth={true}
                      validations={{
                        isWords: true,
                      }}
                      required
                    />
                  </Grid>
                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      variant="outlined"
                      component={TextField}
                      placeholder="Last Name"
                      label="Last Name"
                      fullWidth={true}
                      name="lastname"
                      validations={{
                        isWords: true,
                      }}
                      required
                    />
                  </Grid>
                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      variant="outlined"
                      component={TextField}
                      placeholder="Rewards"
                      label="Rewards"
                      fullWidth={true}
                      type="number"
                      name="rewards"
                      // value={customer.rewards}
                      validations={{
                        isInt: true,
                      }}
                      required
                    />
                  </Grid>

                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      variant="outlined"
                      component={TextField}
                      placeholder="Email"
                      label="Email"
                      fullWidth={true}
                      name="email"
                      required
                    />
                  </Grid>
                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      variant="outlined"
                      component={TextField}
                      placeholder="555-555-555"
                      label="Mobile"
                      fullWidth={true}
                      type="string"
                      name="mobile"
                      required
                    />
                  </Grid>
                  <Grid item style={styles.cell} xs={12} md={4}>
                    {customer.membership && (
                      <Switch
                        checked={customer.membership}
                        color="primary"
                        name="membership"
                        inputProps={{ "aria-label": "membership" }}
                      />
                    )}
                  </Grid>
                  <Grid item style={styles.cell} xs={12} md={4}>
                    {customer.avatar && (
                      <Card style={styles.card}>
                        <img width={100} src={customer.avatar} />
                      </Card>
                    )}
                  </Grid>
                </Grid>
                {/* {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} */}
                <br />
                <Divider />
                {isSubmitting && <LinearProgress />}
                <br />
                <div style={styles.buttons}>
                  <Link to="/customers">
                    <Button variant="contained">
                      {/* onClick={this.handleGoBack}> */}
                      <ArrowBackIosIcon /> Back{" "}
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
                </div>
                <Snackbar
                  open={this.state.snackbarOpen}
                  autoHideDuration={this.state.autoHideDuration}
                  onClose={this.onSnackBarClose}
                >
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
// }

function mapStateToProps(state) {
  const { customer, isFetching,
    //  errorMessage, 
     user, updated } = state.customer;


  return {
    customer,
    isFetching,
    // errorMessage,
    user,
    updated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCustomer: (action) => dispatch(thunkApiCall(action)),
    saveCustomer: (action) => dispatch(thunkApiCall(action)),
    searchCustomer: (action?: TODO) => dispatch(thunkApiCall(action)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerFormPage);
