const formModal = document.getElementById("form-modal");
const confirmModal = document.getElementById("confirm-modal");
const btnOpenForm = document.getElementById("btn-open-form");
const btnSave = document.getElementById("btn-save");
const btnDelete = document.getElementById("btn-delete");

const productForm = new ProductForm();
const htmlTable = new HtmlDataTable("dataTable-1");

btnOpenForm.addEventListener("click", () => productForm.reset());

btnSave.addEventListener("click", async () => {
  try {
    const vBody = productForm.validate();
    if (!vBody) return;
    const func = productForm.action === "create" ? createProduct : updateProduct;
    await func(vBody);
    location.reload();
  } catch (error) {
    const errors = axios.isAxiosError(error) ? error.response.data.errors : error;
    productForm.displayErrors(errors);
  }
});

btnDelete.addEventListener("click", async () => {
  try {
    const cell = htmlTable.getCellContainsId();
    if (!cell) return;
    const id = cell.innerText;
    deleteProduct(id);
    location.reload();
  } catch (error) {
    window.alert("Error");
    console.error(error);
  }
})

async function loadProductData() {
  try {
    const cell = htmlTable.getCellContainsId();
    const userId = getUserId();
    if (!cell || !userId) return;
    const id = cell.innerText;
    const response = await axios({
      method: "GET",
      url: `/users/${userId}/products/${id}`,
      withCredentials: true,
    });
    productForm.loadFrom(response.data);
    $("#form-modal").modal();
  } catch (error) {
    window.alert("Error");
    console.error(error);
  }
}

async function createProduct(body) {
  const userId = getUserId();
  if (!userId) return;
  return axios({
    method: "POST",
    url: `/users/${userId}/products`,
    data: body,
    withCredentials: true,
  });
}

async function updateProduct(body) {
  const cell = htmlTable.getCellContainsId();
  const userId = getUserId();
  if (!cell || !userId) return;
  const id = cell.innerText;
  return axios({
    method: "PUT",
    url: `/users/${userId}/products/${id}`,
    data: body,
    withCredentials: true,
  });
}

async function deleteProduct(id) {
  const userId = getUserId();
  if (!userId) return;
  return axios({
    method: "DELETE",
    url: `/users/${userId}/products/${id}`,
    withCredentials: true,
  });
}

function getUserId() {
  const regex = /\d+/;
  const matches = regex.exec(window.location.pathname);
  if (matches && matches.length) {
    return matches[0];
  }
  return null;
}
