import OrdersTable from "@/components/admin/OrdersTable";
import { Title } from "@/components";

export default function OrdersPage() {
  return (
    <>
      <Title title="Todas las órdenes" />
      <OrdersTable />
    </>
  );
}