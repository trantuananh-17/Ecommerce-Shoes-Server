export function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // loại bỏ dấu
    .replace(/đ/g, "d") // chuyển đ thường thành d
    .replace(/Đ/g, "D") // chuyển Đ hoa thành D
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "") // bỏ ký tự không phải chữ, số, gạch ngang
    .replace(/\-\-+/g, "-");
}
