import styles from './ProductsCard.module.css';
/* eslint-disable react/prop-types */
const ProductsCard = ({ img, product, price }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <img src={img} className={styles.image} />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.product}>{product}</h3>
        <p className="btn btn-dark">N{price}</p>
      </div>
    </div>
  );
};

export default ProductsCard;
