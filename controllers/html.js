exports.getUser = (req, res, next) => {
  if (req.user) {
    return res.send({
      "user": req.user,
      "html":
        `<li class="nav-item dropdown" id="account">
          <a class="nav-link py-0 dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-user"></i>
            ${req.user.name}
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" id="prof-button" href="https://talkabit.org/pages/profile">Profile</a>
              <a class="dropdown-item" id="events-button" href="https://talkabit.org/pages/events">Events</a>
              <a class="dropdown-item disabled" href="#">Achivements</a>
              <a class="dropdown-item" id="logout-button" href="#">Logout</a>
          </div>
        </li>`
    })
  } else {
    return res.send({
      "user": null,
      "html":
        `<li class="nav-item dropdown" id="account">
          <a class="nav-link py-0 dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              <i class="fas fa-user"></i>
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Login</a>
              <a class="dropdown-item" href="#">Register</a>
          </div>
        </li>`
    })
  }
}