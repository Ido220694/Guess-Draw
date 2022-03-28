import React from "react";
import { Form, Field } from "react-final-form";
 import './App.css'
const GuessForm = (props) => {
  const renderError = ({ error, touched }) => {
    if (touched && error) {
      return (
        <div className="ui error message">
          <div className="header">{error}</div>
        </div>
      );
    }
  };
 
  const renderInput = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <div className="guess-input">
          <div className="ui input">
            <input {...input} autoComplete="off" />
          </div>
        </div>
        {renderError(meta)}
      </div>
    );
  };
 
  const onSubmit = (formValues) => {
    props.onSubmit(formValues);
  };
 
  return (
    <Form
      initialValues={props.initialValues}
      onSubmit={onSubmit}
      validate={(formValues) => {
        const errors = {};
 
        if (!formValues.title) {
          errors.title = "You must enter a guess";
        }
        else if(formValues.title!=props.word){
          errors.title = "Wrong Guess. Try Again";
        } 
        return errors;
      }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className="ui form error">
          <Field name="title" component={renderInput} label="Enter Your Guess (small letters only)" />
          <button className="ui button positive">Submit</button>
        </form>
      )}
    />
  );
};
 
export default GuessForm;