const formModal = document.getElementById("form-modal");
const confirmModal = document.getElementById("confirm-modal");
const btnOpenForm = document.getElementById("btn-open-form");
const btnSave = document.getElementById("btn-save");
const btnDelete = document.getElementById("btn-delete");

const userForm = new UserForm();
const htmlTable = new HtmlDataTable("dataTable-1");

btnOpenForm.addEventListener("click", () => userForm.reset());

btnSave.addEventListener("click", async () => {
  try {
    const vBody = userForm.validate();
    if (!vBody) return;
    const func = userForm.action === "create" ? createUser : updateUser;
    await func(vBody);
    location.reload();
  } catch (error) {
    const errors = axios.isAxiosError(error) ? error.response.data.errors : error;
    userForm.displayErrors(errors);
  }
});

btnDelete.addEventListener("click", async () => {
  try {
    const cell = htmlTable.getCellContainsId();
    if (!cell) return;
    const id = cell.innerText;
    await axios({
      method: "DELETE",
      url: `/users/${id}`,
      withCredentials: true,
    });
    location.reload();
  } catch (error) {
    window.alert("Error");
    console.error(error);
  }
})

async function loadUserData() {
  try {
    const cell = htmlTable.getCellContainsId();
    if (!cell) return;
    const id = cell.innerText;
    const response = await axios({
      method: "GET",
      url: `/users/${id}`,
      withCredentials: true,
    });
    userForm.loadFrom(response.data);
    $("#form-modal").modal();
  } catch (error) {
    window.alert("Error");
    console.error(error);
  }
}

async function createUser(body) {
  return axios({
    method: "POST",
    url: "/users",
    data: body,
    withCredentials: true,
  });
}

async function updateUser(body) {
  const cell = htmlTable.getCellContainsId();
  if (!cell) return;
  const id = cell.innerText;
  return axios({
    method: "PUT",
    url: `/users/${id}`,
    data: body,
    withCredentials: true,
  });
}
