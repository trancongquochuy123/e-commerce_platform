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
        console.log(data);
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
                    href="https://s.taobao.com/search?q=%E7%94%B5%E8%84%91"
                  >
                    Computers
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E7%94%B5%E8%84%91%E9%85%8D%E4%BB%B6"
                  >
                    Accessories
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E5%8A%9E%E5%85%AC"
                  >
                    Office
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E6%96%87%E5%85%B7"
                  >
                    Stationery
                  </a>
                </div>
              </li>
              <li className="J_Cat cate--EZsNFK5T">
                <div className="first-cate-container--odleAL9p">
                  <i className="icon-cate--xP_I0ts1 tb-ifont"></i>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E5%AE%B6%E7%94%B5"
                  >
                    Appliances
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E6%89%8B%E6%9C%BA"
                  >
                    Phones
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E8%BF%90%E8%90%A5%E5%95%86"
                  >
                    Telecom
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E6%95%B0%E7%A0%81"
                  >
                    Electronics
                  </a>
                </div>
              </li>
              <li className="J_Cat cate--EZsNFK5T">
                <div className="first-cate-container--odleAL9p">
                  <i className="icon-cate--xP_I0ts1 tb-ifont"></i>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?page=1&q=%E5%B7%A5%E4%B8%9A%E9%9B%B6%E4%BB%B6%E8%80%97%E6%9D%90&tab=all"
                  >
                    Industrial
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?page=1&q=%E5%95%86%E4%B8%9A%E5%8A%9E%E5%85%AC&tab=all"
                  >
                    Business
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?page=1&q=%E5%86%9C%E4%B8%9A%E7%89%A9%E8%B5%84&tab=all"
                  >
                    Agriculture
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?page=1&q=%E4%B8%AA%E6%80%A7%E5%AE%9A%E5%88%B6%E5%A5%BD%E7%89%A9&tab=all"
                  >
                    Custom
                  </a>
                </div>
              </li>
              <li className="J_Cat cate--EZsNFK5T">
                <div className="first-cate-container--odleAL9p">
                  <i className="icon-cate--xP_I0ts1 tb-ifont"></i>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E5%AE%B6%E5%85%B7"
                  >
                    Furniture
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E5%AE%B6%E8%A3%85"
                  >
                    Decor
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?page=1&q=%E5%AE%B6%E5%B1%85&tab=all"
                  >
                    Home
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E5%8E%A8%E5%85%B7"
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
                    href="https://s.taobao.com/search?q=%E5%A5%B3%E8%A3%85"
                  >
                    Women&apos;s Wear
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?page=1&q=%E7%94%B7%E8%A3%85&tab=all"
                  >
                    Men&apos;s Wear
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E5%86%85%E8%A1%A3"
                  >
                    Underwear
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E9%85%8D%E9%A5%B0"
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
                    href="https://s.taobao.com/search?q=%E5%A5%B3%E9%9E%8B"
                  >
                    Women&apos;s Shoes
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E7%94%B7%E9%9E%8B"
                  >
                    Men&apos;s Shoes
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E8%BF%90%E5%8A%A8%E8%A3%85%E5%A4%87"
                  >
                    Sports
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E6%88%B7%E5%A4%96%E7%94%A8%E5%93%81"
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
                    href="https://s.taobao.com/search?page=1&q=%E6%B1%BD%E8%BD%A6&tab=all"
                  >
                    Automotive
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E7%8F%A0%E5%AE%9D"
                  >
                    Jewelry
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E6%96%87%E7%8E%A9"
                  >
                    Collectibles
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E7%AE%B1%E5%8C%85"
                  >
                    Bags
                  </a>
                </div>
              </li>
              <li className="J_Cat cate--EZsNFK5T">
                <div className="first-cate-container--odleAL9p">
                  <i className="icon-cate--xP_I0ts1 tb-ifont"></i>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E9%A3%9F%E5%93%81"
                  >
                    Food
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E7%94%9F%E9%B2%9C"
                  >
                    Fresh
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E9%85%92%E7%B1%BB"
                  >
                    Beverages
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://www.liangxinyao.com/"
                  >
                    Health
                  </a>
                </div>
              </li>
              <li className="J_Cat cate--EZsNFK5T">
                <div className="first-cate-container--odleAL9p">
                  <i className="icon-cate--xP_I0ts1 tb-ifont"></i>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E6%AF%8D%E5%A9%B4"
                  >
                    Baby & Mom
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E7%AB%A5%E8%A3%85"
                  >
                    Kids Wear
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E7%8E%A9%E5%85%B7"
                  >
                    Toys
                  </a>
                  <span className="service-slash--BcpvY80i tb-ifont"></span>
                  <a
                    className="cate-content-href--HI8wwRts"
                    href="https://s.taobao.com/search?q=%E5%AE%A0%E7%89%A9"
                  >
                    Pets
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
                  href="#"
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
                  <a href="" className="btn-open">
                    Store setup
                  </a>
                </div>
              </div>
              {!user && (
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
                <a
                  href="https://favorite.taobao.com/list_bought_shops_n.htm"
                  className="mytao-collectitem"
                >
                  <span className="tb-ifont mytao-icon"></span>
                  <p>Bought</p>
                </a>
              </div>
              <div className="mytao-content">
                <a
                  href="https://i.taobao.com/my_itaobao/subscription"
                  className="mytao-collectitem"
                >
                  <span className="tb-ifont mytao-icon"></span>
                  <p>Followings</p>
                </a>
              </div>
              <div className="mytao-content">
                <a
                  href="https://i.taobao.com/my_itaobao/itao-tool/footMark"
                  className="mytao-collectitem"
                >
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
