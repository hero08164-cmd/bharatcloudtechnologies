import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { EMPTY_DRAFT, ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  return (
    <AdminShell title="New product">
      <ProductForm initial={EMPTY_DRAFT} />
    </AdminShell>
  );
}
