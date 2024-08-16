/* eslint-disable react/no-unescaped-entities */
import styles from './Qualities.module.css';
import quality from '../../assets/quality.png';
import innovation from '../../assets/innovation.png';
import passion from '../../assets/passion.png';

const Qualities = () => {
  return (
    <div className="container px-4 pb-5" id="hanging-icons">
      <h2 className="pb-2 border-bottom">Why Choose Us?</h2>
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <div className="col d-flex align-items-start">
          <div className="rounded-circle text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
            <img
              style={{ width: '48px', height: '48px' }}
              src={passion}
              className="bi"
            />
          </div>
          <div>
            <h3 className="fs-2 text-body-emphasis">Passion</h3>
            <p className={styles.paraText}>
              We are devoted to and passionate about our customers.
            </p>
          </div>
        </div>
        <div className="col d-flex align-items-start">
          <div className="rounded-circle text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
            <img
              src={innovation}
              className="bi"
              style={{ width: '48px', height: '48px' }}
            />
          </div>
          <div>
            <h3 className="fs-2 text-body-emphasis">
              Innovation and Integrity
            </h3>
            <p className={styles.paraText}>
              We are innovators dedicated to tackling today's problems tomorrow
              and We communicate with respect, integrity, courage and candour.
            </p>
          </div>
        </div>
        <div className="col d-flex align-items-start">
          <div className="rounded-circle text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
            <img
              src={quality}
              className="bi"
              style={{ width: '48px', height: '48px' }}
            />
          </div>
          <div>
            <h3 className="fs-2 text-body-emphasis">Quality</h3>
            <p className={styles.paraText}>
              We provide top-notch solutions by providing outstanding
              implementation and support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qualities;
