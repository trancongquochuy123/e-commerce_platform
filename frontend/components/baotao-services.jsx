import "../public/styles/abc.css";
import "../public/styles/main.css";
import "../public/styles/service.css";
import { API_URL } from "@/lib/constants";
import { cookies } from "next/headers";
import LogoutButton from "./logout-button";

export default async function BaotaoService() {
  let user = null;

  try {
    const cookieStore = await cookies();
    const tokenUser = cookieStore.get("tokenUser")?.value;

    if (tokenUser) {
      const res = await fetch(`${API_URL}/user/info`, {
        headers: {
          Cookie: `tokenUser=${tokenUser}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        user = data.data.user;
      }
    }
  } catch (err) {
    console.error("Failed to fetch user info:", err);
  }

  const hour = new Date().getHours();
  let partOfDay = "";
  if (hour >= 5 && hour <= 12) {
    partOfDay = "Morning";
  } else if (hour >= 13 && hour <= 17) {
    partOfDay = "Afternoon";
  } else {
    partOfDay = "Evening";
  }

  return (
    <div className="screen-outer clearfix">
      <div className="main" role="main">
        <div className="tbh-service J_Module category-collapse-container--YDicy8ws collapsed--d7fXmlvn">
          <div className="J_Service container--ZokuQqvw service2024--uYMMvbpy">
            <ul className="service-bd--LdDnWwA9" role="menubar">
              <li className="J_Cat cate--EZsNFK5T">
                <div className="first-cate-container--odleAL9p">
                  <i className="icon-cate--xP_I0ts1 tb-ifont"></i>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="/categories/laptops"
                  >
                    Laptops
                  </a>
                </div>
              </li>
              <li className="J_Cat cate--EZsNFK5T">
                <div className="first-cate-container--odleAL9p">
                  <i className="icon-cate--xP_I0ts1 tb-ifont"></i>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="/categories/phones"
                  >
                    Phones
                  </a>
                </div>
              </li>
              <li className="J_Cat cate--EZsNFK5T">
                <div className="first-cate-container--odleAL9p">
                  <i className="icon-cate--xP_I0ts1 tb-ifont"></i>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="/categories/furniture"
                  >
                    Furniture
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="/categories/kitchen"
                  >
                    Kitchen
                  </a>
                </div>
              </li>
              <li className="J_Cat cate--EZsNFK5T">
                <div className="first-cate-container--odleAL9p">
                  <i className="icon-cate--xP_I0ts1 tb-ifont"></i>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="/categories/women-s-wear"
                  >
                    Women&apos;s Wear
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="/categories/men-s-wear"
                  >
                    Men&apos;s Wear
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="/categories/accessories"
                  >
                    Accessories
                  </a>
                </div>
              </li>
              <li className="J_Cat cate--EZsNFK5T">
                <div className="first-cate-container--odleAL9p">
                  <i className="icon-cate--xP_I0ts1 tb-ifont"></i>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="/categories/women-s-shoes"
                  >
                    Women&apos;s Shoes
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="/categories/men-s-shoes"
                  >
                    Men&apos;s Shoes
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="/categories/sports"
                  >
                    Sports
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="/categories/outdoor"
                  >
                    Outdoor
                  </a>
                </div>
              </li>
              <li className="J_Cat cate--EZsNFK5T">
                <div className="first-cate-container--odleAL9p">
                  <i className="icon-cate--xP_I0ts1 tb-ifont"></i>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="/categories/automotive"
                  >
                    Automotive
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="core J_Core">
          <div className="business-entry-container">
            <div
              className="tbpc-row row-base"
              style={{
                marginLeft: "-8px",
                marginRight: "-8px",
                maxWidth: 1616,
                marginBottom: 16,
              }}
            >
              <div className="tbpc-col tbpc-col-30 business-entry-col tbpc-col tbpc-col-horizon-8 business-entry-col">
                <div className="business-entry-slide-banner" />
              </div>
              <div className="tbpc-col tbpc-col-30 business-entry-col tbpc-col tbpc-col-horizon-8 business-entry-col">
                <div
                  className="business-entry-item-card"
                  style={{ backgroundColor: "rgb(247, 247, 247)" }}
                />
              </div>
            </div>
            <div
              className="tbpc-row row-base"
              style={{
                marginLeft: "-8px",
                marginRight: "-8px",
                maxWidth: 1616,
              }}
            >
              <div className="tbpc-col tbpc-col-15 business-entry-col tbpc-col tbpc-col-horizon-8 business-entry-col">
                <div
                  className="business-entry-item-card"
                  style={{ backgroundColor: "rgb(247, 247, 247)" }}
                />
              </div>
              <div className="tbpc-col tbpc-col-15 business-entry-col tbpc-col tbpc-col-horizon-8 business-entry-col">
                <div
                  className="business-entry-item-card"
                  style={{ backgroundColor: "rgb(247, 247, 247)" }}
                >
                  <div className="business-entry-item-card-content-container" />
                </div>
              </div>
              <div className="tbpc-col tbpc-col-15 business-entry-col tbpc-col tbpc-col-horizon-8 business-entry-col">
                <div
                  className="business-entry-item-card"
                  style={{ backgroundColor: "rgb(247, 247, 247)" }}
                >
                  <div className="business-entry-item-card-content-container" />
                </div>
              </div>
              <div className="tbpc-col tbpc-col-15 business-entry-col tbpc-col tbpc-col-horizon-8 business-entry-col">
                <div
                  className="business-entry-item-card"
                  style={{ backgroundColor: "rgb(247, 247, 247)" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-right" role="complementary">
          <div className="tbh-user J_Module" data-spm="user">
            <div className="user">
              <div
                className="J_UserMemberWrap member-bd member-bd-horiz"
                data-spm="profile"
              >
                <div className="avatar-wrapper avatar-wrapper-order">
                  <a
                    className="J_UserMemberHome member-home"
                    href="#"
                    target="_self"
                    style={{ cursor: "default" }}
                  >
                    <div
                      className="J_UserMemberAvatar member-avatar member-avatar-order"
                      style={{
                        backgroundImage: 'url("")',
                      }}
                    />
                  </a>
                </div>
                <a
                  className="J_UserMemberNickUrl member-nickurl member-nickurl-order"
                  href="#"
                  target="_self"
                >
                  <span className="member-nick-info member-nick-info-order">
                    <strong className="J_UserMemberNick member-nick member-nick-order" />
                  </span>
                </a>
                <a
                  className="J_UserMemberNickUrl member-nickurl-horiz"
                  href={user ? "/account/manage" : "#"}
                  target="_self"
                >
                  <span className="member-nick-info member-nick-info-order">
                    <strong className="J_UserMemberHello member-hello">
                      {user ? `${user.fullName}!` : `Good ${partOfDay}`}
                    </strong>
                  </span>
                </a>
                <div className="member-login-btn-container">
                  {user ? (
                    <LogoutButton className="btn-register" />
                  ) : (
                    <a href="./signup" className="btn-register">
                      Register
                    </a>
                  )}

                  <span className="divider" />
                  {user && user.isSeller ? (
                    <a
                      href="http://localhost:3001/admin/dashboard"
                      className="btn-open"
                    >
                      Store
                    </a>
                  ) : (
                    <a href="/store-setup" className="btn-open">
                      Store setup
                    </a>
                  )}
                </div>
              </div>
              {user ? (
                <div className="member-ft member-ft-order">
                  <div
                    className="member-logout J_UserMemberLogout"
                    style={{ display: "block" }}
                  ></div>
                </div>
              ) : (
                <div className="member-ft member-ft-order">
                  <div
                    className="member-logout J_UserMemberLogout"
                    style={{ display: "block" }}
                  >
                    <div className="login-guide-title">
                      Log in to Baotao for more.
                    </div>
                    <div className="login-guide-desc">
                      Better recommendations and easier search.
                    </div>
                    <a href="/login" className="btn-login ml1 tb-bg weight">
                      Login
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="user-mytao" data-spm="function">
              <div className="mytao-content">
                <a
                  href="https://i.taobao.com/my_itaobao/itao-tool/collect"
                  className="mytao-collectitem"
                >
                  <span className="tb-ifont mytao-icon"></span>
                  <p>Favourites</p>
                </a>
              </div>
              <div className="mytao-content">
                <a href="/orders/bought" className="mytao-collectitem">
                  <span className="tb-ifont mytao-icon"></span>
                  <p>Bought</p>
                </a>
              </div>
              <div className="mytao-content">
                <a href="#" className="mytao-collectitem">
                  <span className="tb-ifont mytao-icon"></span>
                  <p>Followings</p>
                </a>
              </div>
              <div className="mytao-content">
                <a href="/orders" className="mytao-collectitem">
                  <span className="tb-ifont mytao-icon"></span>
                  <p>Orders</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
