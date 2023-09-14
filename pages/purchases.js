import { BackButton } from "@/components/reusable/BackButton";
import { GET_ORDERS } from "@/GQL/query";
import { withUser } from "@/Hoc/withUser";
import styles from "@/styles/Purchases.module.scss";

const Order = ({ order }) => {
  const {
    id,
    status,
    payment_env,
    amount,
    product,
    createdAt,
    transaction_details,
    payment_details,
  } = order;

  const date = new Date(createdAt).toLocaleDateString();

  function getStatusColor(status) {
    switch (status) {
      case "paid":
        return "#84e05f";
      case "pending":
        return "yellow";
      case "failed":
        return "red";
      default:
        return "black"; // Default color or another color of your choice
    }
  }

  return (
    <div className={styles.orderItem}>
      <div className={styles.orderHeader}>
        <h3 className={styles.orderTitle}>Order ID: {id}</h3>
        <p
          className={styles.orderStatus}
          style={{ color: getStatusColor(status) }}
        >
          {status}
        </p>
      </div>
      <div className={styles.orderDetails}>
        <p className={styles.productName}>Product: {product.name}</p>
        <p className={styles.amount}>Amount: ${amount}</p>
        <p className={styles.createdAt}>Date: {date}</p>
      </div>
    </div>
  );
};

const Orders = (props) => {
  const { data } = props;

  const orders = data.orders;

  return (
    <div className="background_dark">
      <div className="section">
        <>
          <div className={styles.header}>
            <BackButton routeStatic={"/settings"} />
            <div className="header">Purchases</div>
          </div>

          {data && (
            <div className={styles.ordersContainer}>
              {orders.map((order, i) => {
                return <Order order={order} key={i} />;
              })}
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default withUser(Orders, GET_ORDERS, false, true);
