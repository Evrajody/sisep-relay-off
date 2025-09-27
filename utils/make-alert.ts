import Swal from "sweetalert2";

interface AlertElement {
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  extraClass?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function (info: AlertElement) {
  return Swal.fire({
    icon: info.type,
    html:
      '<div class="mt-3">' +
      '<div class="mt-4 ">' +
      '<h4 class="font-extrabold mb-2 text-xl lg:text-2xl uppercase"> ' +
      `${info.title}` +
      "</h4>" +
      '<p class="text-gray-600 mx-4 mb-2 text-base font-bold">' +
      `${info.message}` +
      " </p>" +
      "</div>" +
      "</div>",
    showCancelButton: false,
    showConfirmButton: true,
    confirmButtonColor: "#0A3764",
    confirmButtonText: "OK",
    buttonsStyling: true,
    showCloseButton: false,
  });
}
