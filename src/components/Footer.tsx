
export default function Footer() {
  return (
<div className=" block print:hidden">
          <div className="text-xs mx-auto">
            <footer className="footer mt-4  text-slate-100 p-4 text-center font-medium  shadow md:text-left">
              &copy;
              <script>document.write(new Date().getFullYear());</script>
              Afill | All right reserved.
              <span 
              className="float-right hidden md:inline-block ">
                Crafted by Lich Coding
              </span>
              
            </footer>
          </div>
        </div>
  )
}
