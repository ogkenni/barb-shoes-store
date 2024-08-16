import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import styles from './Contact.module.css';
import { Formik } from 'formik';
import errImg from '../../assets/Group 20.png';

const Contact = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <p>Business Address: Obafemi Awolowo way, Ikeja Lagos.</p>
        <p>Phone Number: +2345678966</p>
        <p>Email: solabarb@gmail.com </p>
        <div className={styles.contact}>
          <h2>Contact Form</h2>
          <p>
            Want to reach out to the CEO directly? <br />
            Please, fill this form below
          </p>
          <Formik
            initialValues={{ name: '', email: '', message: '' }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = 'Required, Kindly enter an email';
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Sorry, invalid format here';
              }
              return errors;
            }}
            onSubmit={(values, { resetForm }) => {
              alert('Submitted');
              // Optionally, you can handle the form submission here (e.g., send data to server)
              resetForm(); // Optionally reset the form after submission
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">
                  <input
                    type="text"
                    placeholder="NAME"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                </label>
                <label htmlFor="email">
                  <input
                    type="text"
                    placeholder="EMAIL"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    style={
                      errors.email && touched.email
                        ? { borderBottom: '2px solid #ff6f5b' }
                        : null
                    }
                  />
                  {errors.email && touched.email && (
                    <img
                      src={errImg}
                      alt="error image"
                      className={styles.error}
                      style={{ height: '20px', width: '20px' }}
                    />
                  )}
                </label>
                <small className={styles.small}>
                  {errors.email && touched.email && errors.email}
                </small>
                <label htmlFor="message">
                  <textarea
                    name="message"
                    placeholder="MESSAGE"
                    rows={4}
                    id="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.message}
                  ></textarea>
                </label>
                <div className={styles.button}>
                  <button type="submit" className={styles.navButton}>
                    Submit
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
