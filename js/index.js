// Tạo function để xóa nhân viên
// Tạo function để cập nhật thông tin nhân viên
var employeeList = [];
//6. Lấy thông tin từ Local storage
getData();
clearSucessNotice()
// 7. Form validate tổng hợp tất cả các mục
function validateForm() {
  var employeeAccount = document.getElementById("tknv").value;
  var employeeName = document.getElementById("name").value;
  var employeeEmail = document.getElementById("email").value;
  var employeePassword = document.getElementById("password").value;
  var employeeStartDate = document.getElementById("datepicker").value;
  var employeeBasicSalary = document.getElementById("luongCB").value;
  var employeePosition = document.getElementById("chucvu").value;
  var employeeWorkingHours = document.getElementById("gioLam").value;
  var isValid = true;
  isValid &=
    required(employeeAccount, "tbTKNV") &&
    checkAccout(employeeAccount, "tbTKNV");

  isValid &=
    required(employeeName, "tbTen") && checkName(employeeName, "tbTen");

  isValid &=
    required(employeeEmail, "tbEmail") && checkEmail(employeeEmail, "tbEmail");

  isValid &=
    required(employeePassword, "tbMatKhau") &&
    checkPassword(employeePassword, "tbMatKhau", 6, 10);

  isValid &=
    required(employeeStartDate, "tbNgay") &&
    checkDate(employeeStartDate, "tbNgay");

  isValid &=
    required(employeeBasicSalary, "tbLuongCB") &&
    checkRange(
      employeeBasicSalary,
      "tbLuongCB",
      1000000,
      20000000,
      "Lương cơ bản",
      "(VND)"
    );

  isValid &= required(employeePosition, "tbChucVu");

  isValid &=
    required(employeeWorkingHours, "tbGiolam") &&
    checkRange(employeeWorkingHours, "tbGiolam", 80, 200, "Giờ làm", "(giờ)");
  return isValid;
}

// tạo một chức năng để lấy input
function createEmployee() {
  //7.10. check validation
  if (!validateForm()) {
    return;
  }
  //1. Lấy input
  var employeeAccount = document.getElementById("tknv").value;
  var employeeName = document.getElementById("name").value;
  var employeeEmail = document.getElementById("email").value;
  var employeePassword = document.getElementById("password").value;
  var employeeStartDate = document.getElementById("datepicker").value;
  var employeeBasicSalary = document.getElementById("luongCB").value;
  var employeePosition = document.getElementById("chucvu").value;
  var employeeWorkingHours = document.getElementById("gioLam").value;
  //1.1 Kiểm tra xem trong danh sách nhân viên có account nào bị trùng với account vừa nhập hay không
  for (var i = 0; i < employeeList.length; i++) {
    if (employeeAccount === employeeList[i].account) {
      alert("Mã nhân viên bị trùng");
      return;
    }
  }
  //2. Tạo object nhân viên mới
  var employee = new Employee(
    employeeAccount,
    employeeName,
    employeeEmail,
    employeePassword,
    employeeStartDate,
    employeeBasicSalary,
    employeePosition,
    employeeWorkingHours
  );
  //3. Đưa thông tin nhân viên vào trong danh sách
  employeeList.push(employee);
  //4. In thông tin nhân viên
  renderEmployee();
  //5. Lưu thông tin nhân viên vào local Storage
  saveData();
  clearForm();
  //10. Thông báo thêm thành công
  document.getElementById("tbThem").innerHTML = "Thêm thành công";
  hideBtn();
  clearBtn.classList.remove("btn-hide");
  addBtn.classList.remove("btn-hide");
  closeBtn.classList.remove("btn-hide");
}

//4.1. Chức năng in thông tin nhân viên
function renderEmployee(list) {
  if (!list) {
    list = employeeList;
  }
  //4.2. Làm mới lại danh sách để không bị in trùng lặp trên màn hình
  var html = "";
  //4.3. Chạy vòng lặp trong danh sách nhân viên, tạo ra mảng text tương ứng với nội dung trong html
  for (var i = 0; i < list.length; i++) {
    html += `<tr>
     <td>${list[i].account}</td>
     <td>${list[i].fullName}</td>
     <td>${list[i].email}</td>
     <td>${list[i].startDate}</td>
     <td>${list[i].position}</td>
     <td>${list[i].calcSalary()}</td>
     <td>${list[i].grading()}</td>
     <td>
        <button onclick="deleteEmployee('${
          list[i].account
        }')" class="btn btn-danger">Xóa</button>
        <button onclick="getEmployeeDetail('${
          list[i].account
        }')" class="btn btn-info" data-toggle="modal" data-target="#myModal">Update</button>
      </td>   
    </tr>`;
  }

  // 4.4. Gán giá trị của html vào trong thành phần table của html để in thông tin
  document.getElementById("tableDanhSach").innerHTML = html;
}

//5.1. Chức năng lưu thông tin
function saveData() {
  //5.2. chuyển sang định dạng JSON(Java Script Object Notation) để local storage đọc được
  var employeeListJSON = JSON.stringify(employeeList);
  //5.3. Lưu
  localStorage.setItem("Danh sách nhân viên", employeeListJSON);
}

//6.1 Chức năng in thông tin từ local storage
function getData() {
  //6.2. tạo biến để chứa thông tin từ local storage
  employeeListJSON = localStorage.getItem("Danh sách nhân viên");

  //6.3. Nếu không có sẵn thông tin trong local thì hàm này không chạy
  if (!employeeListJSON) return;
  //6.4. chuyển về định dạng object của JS
  employeeListLocal = JSON.parse(employeeListJSON);
  // note: khi chuyển định dạng của JS về JSON ở bước 5 thì object sẽ bị mất hết method
  // => 6.5. Định dạng lại data
  employeeList = mapData(employeeListLocal);
  //6.6. in ra màn hình
  renderEmployee();
}

// 6.5.1 Chức năng định dạng lại data
//6.5.2. truyền vào dữ liệu vừa lấy từ local
function mapData(localData) {
  // 6.5.3 tạo một biến để chứa dữ liệu nhận từ local (vì biến này còn sử dụng ở dòng sau nên đặt là oldEmployee để tiện hình dung)
  var oldEmployeeInfo = localData;
  // 6.5.4 tạo mới lại một đối tượng khác với thông tin tương tự (giúp tạo lại method của đối tượng)
  for (var i = 0; i < localData.length; i++) {
    var mappedInfo = new Employee(
      oldEmployeeInfo[i].account,
      oldEmployeeInfo[i].fullName,
      oldEmployeeInfo[i].email,
      oldEmployeeInfo[i].password,
      oldEmployeeInfo[i].startDate,
      oldEmployeeInfo[i].basicSalary,
      oldEmployeeInfo[i].position,
      oldEmployeeInfo[i].workingHours
    );

    employeeList.push(mappedInfo);
  }

  return employeeList;
}

//7.1. Không để trống

function required(value, spanId) {
  if (value.length === 0) {
    document.getElementById(spanId).classList.add("show");
    document.getElementById(spanId).innerHTML = "*Không được để trống";
    return false;
  }
  document.getElementById(spanId).classList.remove("show");
  return true;
}

//7.2. Validate account

function checkAccout(value, spanId) {
  var pattern = /[0-9]{4,6}/g;
  if (!pattern.test(value)) {
    document.getElementById(spanId).classList.add("show");
    document.getElementById(spanId).innerHTML =
      "*Tài khoản chỉ được chứa 4-6 ký số";
    return false;
  }
  document.getElementById(spanId).classList.remove("show");
  return true;
}

//7.3. Validate tên nhân viên

function checkName(value, spanId) {
  var pattern =
    /[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ]{1}[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý]*$/;
  var splitName = value.split(" ");
  for (var i = 0; i < splitName.length; i++) {
    if (!pattern.test(splitName[i])) {
      document.getElementById(spanId).classList.add("show");
      document.getElementById(spanId).innerHTML =
        "*Tên không được chứa số hoặc ký tự đặc biệt và phải viết hoa chữ cái đầu";
      return false;
    }
  }

  document.getElementById(spanId).classList.remove("show");
  return true;
}

//7.4. Validate email

function checkEmail(value, spanId) {
  var pattern =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

  if (!pattern.test(value)) {
    document.getElementById(spanId).classList.add("show");
    document.getElementById(spanId).innerHTML = "*Email không đúng định dạng";
    return false;
  }

  document.getElementById(spanId).classList.remove("show");
  return true;
}

//7.5. Validate password

function checkPassword(value, spanId, min, max) {
  //7.5.2. Check Password Pattern
  var pattern =
    /(?=.{6,10})(?=.*\d+)(?=.*[A-Z]+)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)/;

  if (!pattern.test(value)) {
    document.getElementById(spanId).classList.add("show");
    document.getElementById(spanId).innerHTML =
      "*Mật khẩu từ 6 - 10 ký tự có chứa ít nhất một ký tự số, một ký tự in hoa và một ký tự đặc biệt";
    return false;
  }

  document.getElementById(spanId).classList.remove("show");
  return true;
}

// 7.6 Validate date
function checkDate(value, spanId) {
  // 7.6.1. Check định dạng cơ bản (1-2 số/1-2 số/ 4 số)
  var pattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!pattern.test(value)) {
    document.getElementById(spanId).classList.add("show");
    document.getElementById(spanId).innerHTML =
      "*Định dạng ngày không đúng (Địng dạng đúng: mm/dd/yyyy)";
    return false;
  }
  // 7.6.2. Check xem dữ liệu ngày tháng năm nhập có chính xác hay không
  var dayMonthYear = value.split("/");
  var month = parseInt(dayMonthYear[0]);
  var day = parseInt(dayMonthYear[1]);
  var year = parseInt(dayMonthYear[2]);
  // 7.6.3. Check dữ liệu năm (tùy thuộc vào thời gian thực có thể thay đổi điều kiện)
  if (year > 2022) {
    document.getElementById(spanId).classList.add("show");
    document.getElementById(spanId).innerHTML = "*Năm không hợp lệ";
    return false;
  }
  //7.6.4. Check dữ liệu tháng
  if (month > 12 || month < 1) {
    document.getElementById(spanId).classList.add("show");
    document.getElementById(spanId).innerHTML = "*Tháng không hợp lệ";
    return false;
  }
  //7.6.5. Check dữ liệu ngày

  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  //7.6.5.1. Đổi độ dài tháng 2 nếu năm nhập là năm nhuận
  if (year % 4 === 0) {
    monthLength[1] = 29;
  }

  if (day < 0 || day > monthLength[month - 1]) {
    document.getElementById(spanId).classList.add("show");
    document.getElementById(spanId).innerHTML = "*Ngày không hợp lệ";
    return false;
  }

  document.getElementById(spanId).classList.remove("show");
  return true;
}

//7.6. Check lương cơ bản và giờ làm

function checkRange(value, spanId, min, max, type, unit) {
  //7.6.1. Chỉ cho phép nhập số
  var pattern = /^\d+$/;
  if (!pattern.test(value)) {
    document.getElementById(spanId).classList.add("show");
    document.getElementById(spanId).innerHTML =
      "*Chỉ được nhập số cho mức lương";
    return false;
  }
  //7.6.2. Lọc giá trị trong khoảng
  if (value < min || value > max) {
    document.getElementById(spanId).classList.add("show");
    document.getElementById(
      spanId
    ).innerHTML = `*${type} chỉ nhận giá trị từ ${min} đến ${max} ${unit}`;
    return false;
  }

  document.getElementById(spanId).classList.remove("show");
  return true;
}

//8. Xóa tài khoản nhân viên

function deleteEmployee(employeeId) {
  //8.1. Tìm vị trí dựa vào index
  var index = findById(employeeId);
  //8.2. Xóa thông tin nhân viên (1 phần tử trong mảng) ra khỏi mảng employeeList
  employeeList.splice(index, 1);
  //8.3. Lưu thông tin vào local storage
  saveData();
  //8.4. In ra mảng mới sau khi bị xóa
  renderEmployee();
}

//8.1.1. Tìm index của nhân viên

function findById(employeeId) {
  for (var i = 0; i < employeeList.length; i++) {
    if (employeeId === employeeList[i].account) {
      return i;
    }
  }
  return -1;
}

//9. clear form
function clearForm() {
  //Tắt hết span khi mở form
  document.getElementById("tbTKNV").classList.remove("show");
  document.getElementById("tbTen").classList.remove("show");
  document.getElementById("tbEmail").classList.remove("show");
  document.getElementById("tbMatKhau").classList.remove("show");
  document.getElementById("tbNgay").classList.remove("show");
  document.getElementById("tbLuongCB").classList.remove("show");
  document.getElementById("tbChucVu").classList.remove("show");
  document.getElementById("tbGiolam").classList.remove("show");
  //Reset thông tin điền
  document.getElementById("formDien").reset();
  //Bỏ thông báo điền thành công
  document.getElementById("tbThem").innerHTML = "";
}

//11. update form
//11.1. Lấy thông tin thông qua id
function getEmployeeDetail(employeeId) {
  //Clear form
  clearForm();
  hideBtn();
  //Hiện nút cần thêm
  updateBtn.classList.remove("btn-hide");
  closeBtn.classList.remove("btn-hide");

  //11.1.1. tìm được vị trí của nhân viên thông qua id
  var index = findById(employeeId);
  if (index === -1) {
    alert("Không tìm thấy id phù hợp!");
    return;
  }
  //11.1.2. Đưa thông tin cần cập nhật lên form theo id vừa tìm được
  document.getElementById("tknv").value = employeeList[index].account;
  document.getElementById("name").value = employeeList[index].fullName;
  document.getElementById("email").value = employeeList[index].email;
  document.getElementById("password").value = employeeList[index].password;
  document.getElementById("datepicker").value = employeeList[index].startDate;
  document.getElementById("luongCB").value = employeeList[index].basicSalary;
  document.getElementById("chucvu").value = employeeList[index].position;
  document.getElementById("gioLam").value = employeeList[index].workingHours;
  //11.1.3. Không cho người dùng sửa tknv
  document.getElementById("tknv").disabled = true;
}

//11.2. Cập nhật thông tin khi nhất nút cập nhật
function updateEmployee() {
  //11.2.1 Lấy thông tin đã nhập
  var employeeAccount = document.getElementById("tknv").value;
  var employeeName = document.getElementById("name").value;
  var employeeEmail = document.getElementById("email").value;
  var employeePassword = document.getElementById("password").value;
  var employeeStartDate = document.getElementById("datepicker").value;
  var employeeBasicSalary = document.getElementById("luongCB").value;
  var employeePosition = document.getElementById("chucvu").value;
  var employeeWorkingHours = document.getElementById("gioLam").value;

  //11.2.2 Validate form nhập

  if (!validateForm()) {
    document.getElementById("tbThem").innerHTML = "";
    return;
  }

  //11.2.3. Tìm theo Id

  var index = findById(employeeAccount);

  if (index === -1) {
    alert("Không tìm thấy id phù hợp!");
    return;
  }
  var employee = employeeList[index];

  if (
    employeeName === employee.fullName &&
    employeeEmail === employee.email &&
    employeePassword === employee.password &&
    employee.startDate === employeeStartDate &&
    employee.basicSalary === employeeBasicSalary &&
    employee.position === employeePosition &&
    employee.workingHours === employeeWorkingHours
  ) {
    alert("Không có thông tin nào được cập nhật");
    return;
  }

  employee.fullName = employeeName;
  employee.email = employeeEmail;
  employee.password = employeePassword;
  employee.startDate = employeeStartDate;
  employee.basicSalary = employeeBasicSalary;
  employee.position = employeePosition;
  employee.workingHours = employeeWorkingHours;

  renderEmployee();
  saveData();
  document.getElementById("tbThem").innerHTML = "Cập nhật thành công";
}

// Ẩn tất cả các nút trong form
function hideBtn() {
  addBtn = document.getElementById("btnThemNV");
  closeBtn = document.getElementById("btnDong");
  clearBtn = document.getElementById("btnClear");
  updateBtn = document.getElementById("btnCapNhat");

  // Thêm hết 1 loạt hide cho 4 nút
  addBtn.classList.add("btn-hide");
  closeBtn.classList.add("btn-hide");
  clearBtn.classList.add("btn-hide");
  updateBtn.classList.add("btn-hide");
}

// 12. bring up modal: hiện nút thêm với nút đóng

function bringUpModal() {
  //bỏ disable sau khi cập nhật (nếu có)
  document.getElementById("tknv").disabled = false;
  addBtn = document.getElementById("btnThemNV");
  closeBtn = document.getElementById("btnDong");
  clearForm();
  hideBtn();
  //bỏ hide cho button cần hiện
  addBtn.classList.remove("btn-hide");
  closeBtn.classList.remove("btn-hide");
  clearBtn.classList.remove("btn-hide");
}

//13 bỏ thông báo thêm thành công hay cập nhật thành công khi user bắt đầu nhập
function clearSucessNotice() {
  document.getElementById("tknv").oninput = function () {
    document.getElementById("tbThem").innerHTML = "";
  };
  document.getElementById("name").oninput = function () {
    document.getElementById("tbThem").innerHTML = "";
  };
  document.getElementById("email").oninput = function () {
    document.getElementById("tbThem").innerHTML = "";
  };
  document.getElementById("password").oninput = function () {
    document.getElementById("tbThem").innerHTML = "";
  };
  document.getElementById("datepicker").oninput = function () {
    document.getElementById("tbThem").innerHTML = "";
  };
  document.getElementById("luongCB").oninput = function () {
    document.getElementById("tbThem").innerHTML = "";
  };
  document.getElementById("chucvu").oninput = function () {
    document.getElementById("tbThem").innerHTML = "";
  };
  document.getElementById("gioLam").oninput = function () {
    document.getElementById("tbThem").innerHTML = "";
  };
}

// 14. Chức năng search

function searchEmployee() {
  //Tạo biến mảng chứa các giá trị tìm được
  var result = [];
  //Lấy dữ liệu nhập từ thanh search
  var keyword = document.getElementById("searchName").value;
  //Dò trong danh sách tìm ra nhân viên có loại ứng với loại cần tìm
  for (var i = 0; i < employeeList.length; i++) {
    var employeeGrade = employeeList[i].grading();
    if (keyword.toLowerCase() === employeeGrade.toLowerCase()) {
      result.push(employeeList[i]);
    }
  }
  console.log(result);
  renderEmployee(result);
}
