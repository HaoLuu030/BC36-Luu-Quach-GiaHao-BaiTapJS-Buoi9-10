
//tạo một object function (constructor)

function Employee(
  account,
  fullName,
  email,
  password,
  startDate,
  basicSalary,
  position,
  workingHours
) {
  this.account = account;
  this.fullName = fullName;
  this.email = email;
  this.password = password;
  this.startDate = startDate;
  this.basicSalary = basicSalary;
  this.position = position;
  this.workingHours = workingHours;

  this.calcSalary = function() {
    switch (this.position) {
      case "Sếp":
        return this.basicSalary * 3;
      case "Trưởng phòng":
        return this.basicSalary * 2;
      case "Nhân viên":
        return this.basicSalary * 1;
    }
  }

  this.grading =function() {
    if (this.workingHours >= 192) {
      return "Xuất sắc";
    } else if (this.workingHours >= 172) {
      return "Giỏi";
    } else if (this.workingHours >= 160) {
      return "Khá";
    } else {
      return "Trung bình";
    }
  }
}
