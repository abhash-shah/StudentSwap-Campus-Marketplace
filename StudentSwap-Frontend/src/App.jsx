import React, { useEffect, useMemo, useState } from 'react';


const money = (amount) => `₹${amount.toLocaleString('en-IN')}`;

function Brand() {
  return <a className="brand" href="#" aria-label="StudentSwap home"><span className="brand-mark"><i className="bi bi-arrow-left-right" /></span><span>student<span className="brand-accent">swap</span><small>THE CAMPUS CIRCLE</small></span></a>;
}

function App() {
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState('');
  const [dbProducts, setDbProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/listings')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load listings');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Listings from MySQL:', data);
        setDbProducts(data);
      })
      .catch((error) => {
        console.error('Error loading listings:', error);
      })
      .finally(() => {
        setProductsLoading(false);
      });
  }, []);


  useEffect(() => {
    fetch('http://localhost:8080/api/categories')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load categories');
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
        setCategoryError('');
        console.log('Categories from MySQL:', data);
      })
      .catch((error) => {
        console.error('Category fetch failed:', error);
        setCategoryError('Could not load categories from the server.');
      });
  }, []);

  const [activeCategory, setActiveCategory] = useState('All items');
  const [search, setSearch] = useState('');
  const [showSellNotice, setShowSellNotice] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminRequests, setShowAdminRequests] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuth, setAdminAuth] = useState('');
  const [adminError, setAdminError] = useState('');
  const [contactRequests, setContactRequests] = useState([]);
  const [session, setSession] = useState(() => { try { return JSON.parse(localStorage.getItem('studentswap_session') || 'null'); } catch { return null; } });
  const [showStudentAuth, setShowStudentAuth] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [inbox, setInbox] = useState([]);
  const [showInbox, setShowInbox] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [saved, setSaved] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const displayProducts = dbProducts.map((item) => ({
    id: item.listingId,
    title: item.title,
    category:
      categories.find(
        (cat) => cat.categoryId === item.categoryId
      )?.categoryName || 'Other',
    price: Number(item.price),
    oldPrice: Number(item.price),
    condition: item.conditionStatus,
    seller: item.sellerName || `Student ${item.sellerId}`,
    ownerId: item.ownerId,
    year: '',
    image: item.imageUrl || '',
    color: 'product-default',
  }));

  const filteredProducts = useMemo(() => {
    return displayProducts.filter((p) => {
      const categoryMatch =
        activeCategory === 'All items' ||
        p.category === activeCategory;

      const q = search.trim().toLowerCase();

      const searchMatch =
        !q ||
        `${p.title} ${p.category} ${p.seller} ${p.year}`
          .toLowerCase()
          .includes(q);

      return categoryMatch && searchMatch;
    });
  }, [dbProducts, categories, activeCategory, search]);


  const toggleSaved = (id) => setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  
const apiHeaders = (json = true) => ({
  ...(json ? { 'Content-Type': 'application/json' } : {}),
  ...(session?.token ? { Authorization: `Bearer ${session.token}` } : adminAuth ? { Authorization: `Basic ${adminAuth}` } : {})
});
const signOut = async () => {
  if (session?.token) await fetch('http://localhost:8080/api/auth/logout', { method:'POST', headers: { Authorization: `Bearer ${session.token}` } }).catch(() => {});
  localStorage.removeItem('studentswap_session'); setSession(null); setShowInbox(false);
};
const submitStudentAuth = async (e) => {
  e.preventDefault(); setAuthError('');
  const data = Object.fromEntries(new FormData(e.currentTarget));
  try {
    const response = await fetch(`http://localhost:8080/api/auth/${registerMode ? 'register' : 'login'}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Authentication failed');
    localStorage.setItem('studentswap_session',JSON.stringify(result)); setSession(result); setShowStudentAuth(false);
  } catch(err){setAuthError(err.message);}
};
const loadInbox = async () => {
  try {const response=await fetch('http://localhost:8080/api/messages',{headers:apiHeaders()});const data=await response.json();if(!response.ok)throw new Error(data.error || 'Cannot load inbox');setInbox(data);setShowInbox(true);}catch(err){alert(err.message);}
};
const deleteMyAccount = async () => {
  if(!window.confirm('Permanently delete your account, listings and messages? This cannot be undone.'))return;
  try {const response=await fetch('http://localhost:8080/api/auth/me',{method:'DELETE',headers:apiHeaders()});const data=await response.json();if(!response.ok)throw new Error(data.error || 'Could not delete account');localStorage.removeItem('studentswap_session');setSession(null);window.location.reload();}catch(err){alert(err.message);}
};
const adminHeaders = () => ({
  'Authorization': `Basic ${adminAuth}`,
  'Content-Type': 'application/json'
});

const handleAdminLogin = async (e) => {
  e.preventDefault();
  const encoded = btoa(`${adminUsername}:${adminPassword}`);
  try {
    const response = await fetch('http://localhost:8080/api/admin/contact-requests', {
      headers: { 'Authorization': `Basic ${encoded}` }
    });
    if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? 'Incorrect admin username or password.' : 'Admin login failed.');
    const data = await response.json();
    setAdminAuth(encoded);
    setContactRequests(data);
    setAdminError('');
    setShowAdminLogin(false);
    setShowAdminRequests(true);
    setAdminPassword('');
  } catch (error) {
    setAdminError(error.message);
  }
};

const loadAdminRequests = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/admin/contact-requests', { headers: { 'Authorization': `Basic ${adminAuth}` } });
    if (!response.ok) throw new Error('Could not load requests. Please log in again.');
    setContactRequests(await response.json());
    setShowAdminRequests(true);
  } catch (error) { alert(error.message); setAdminAuth(''); }
};


const deleteContactRequest = async (requestId) => {
  if (!window.confirm(`Permanently delete contact request #${requestId}?`)) return;
  try {
    const response = await fetch(
      `http://localhost:8080/api/admin/contact-requests/${requestId}`,
      { method: 'DELETE', headers: { Authorization: `Basic ${adminAuth}` } }
    );
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || 'Could not delete this request.');
    }
    setContactRequests((previous) =>
      previous.filter((request) => request.requestId !== requestId)
    );
  } catch (error) {
    alert(error.message);
  }
};

const handleEditListing = async (product) => {
  const original = dbProducts.find(
    (item) => item.listingId === product.id
  );

  if (!original) {
    alert("Listing not found.");
    return;
  }

  const title = window.prompt("Enter listing title:", original.title);
  if (title === null) return;

  if (!title.trim()) {
    alert("Title cannot be empty.");
    return;
  }

  const priceText = window.prompt(
    "Enter price (₹):",
    String(original.price)
  );
  if (priceText === null) return;

  const price = Number(priceText);

  if (priceText.trim() === "" || !Number.isFinite(price) || price < 0) {
    alert("Please enter a valid price.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/listings/${product.id}`,
      {
        method: "PUT",
        headers: apiHeaders(),
        body: JSON.stringify({
          title: title.trim(),
          price,
          description: original.description,
          conditionStatus: original.conditionStatus,
          categoryId: original.categoryId
        })
      }
    );

    if (!response.ok) {
      throw new Error(await response.text() || "Update failed.");
    }

    alert("Listing updated successfully!");
    window.location.reload();
  } catch (error) {
    alert("Could not update listing: " + error.message);
  }
};

const handleDeleteListing = async (product) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${product.title}"?`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:8080/api/listings/${product.id}`,
      { method: "DELETE", headers: apiHeaders() }
    );

    if (!response.ok) {
      throw new Error(await response.text() || "Delete failed.");
    }

    alert("Listing deleted successfully!");
    window.location.reload();
  } catch (error) {
    alert("Could not delete listing: " + error.message);
  }
};


  return (
    <div className="app-shell">
      <div className="top-strip"><span><i className="bi bi-stars me-2" />Good finds. Better student budgets.</span><span className="top-strip-right">Made for campus life in Bengaluru <i className="bi bi-geo-alt ms-1" /></span></div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className="main-nav d-none d-lg-flex">
            <a className="nav-link active" href="#explore">Explore</a>
            <a className="nav-link" href="#semester-sale">Semester sale</a>
            <a className="nav-link" href="#how-it-works">How it works</a>
          </nav>
          <div className="header-actions">
            {session ? <><span className="d-none d-md-inline">Hi, {session.user.name}</span><button className="btn btn-outline-dark btn-sm" onClick={loadInbox}>Inbox</button><button className="btn btn-outline-dark btn-sm" onClick={signOut}>Logout</button></> : <button className="btn btn-outline-dark btn-sm" onClick={() => setShowStudentAuth(true)}>Student Login / Sign up</button>}
            <button className="icon-button saved-button" onClick={() => { setActiveCategory('All items'); setSearch(''); document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' }); }} aria-label="Show all items"><i className="bi bi-heart" /><span className="saved-count">{saved.length}</span></button>
            <button className="btn btn-dark sell-button" onClick={() => session ? setShowSellNotice(true) : setShowStudentAuth(true)}><i className="bi bi-plus-lg me-2" />Sell an item</button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> BUY SMART. PASS IT ON.</div>
              <h1>Your next college<br />essential is <em>already</em><br />out there.</h1>
              <p className="hero-description">A marketplace made for students. Find pre-loved books, gadgets and campus essentials from people who get your college life.</p>
              <div className="hero-search">
                <i className="bi bi-search" />
                <input aria-label="Search items" value={search} onChange={(e) => { setSearch(e.target.value); document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} placeholder="Search books, calculators, cycles..." />
                <button onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>Search</button>
              </div>
              <div className="hero-proof"><div className="avatar-stack"><span>A</span><span>N</span><span>R</span><span>+</span></div><span><strong>Made for student-to-student swaps</strong><br />Spend less. Waste less. Share more.</span></div>
            </div>
            <div className="hero-art">
              <div className="hero-image-wrap"><img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1100&q=90" alt="Books arranged on a study desk" /></div>
              <div className="floating-note note-top"><span className="note-icon"><i className="bi bi-book-half" /></span><span><strong>Pass it forward</strong><small>One senior's old book...</small></span></div>
              <div className="floating-note note-bottom"><span className="note-icon note-icon-green"><i className="bi bi-mortarboard" /></span><span><strong>...a junior's big save</strong><small>Good finds stay on campus.</small></span></div>
              <div className="hero-sticker"><i className="bi bi-arrow-repeat" /><span>Reuse<br />rejoice.</span></div>
            </div>
          </div>
          <div className="hero-bottom container"><span><i className="bi bi-check-circle-fill" /> Student-first marketplace</span><span><i className="bi bi-check-circle-fill" /> Campus pickup</span><span><i className="bi bi-check-circle-fill" /> Give good stuff a second life</span></div>
        </section>

        <section className="category-section container" id="explore">
          <div className="section-heading"><div><span className="eyebrow">FIND YOUR THING</span><h2>Browse by category<span className="heading-period">.</span></h2></div><span className="section-side-note">The good stuff, all in one place.</span></div>
          <div className="category-list">

            {[
              { name: 'All items' },
              ...categories.map((cat) => ({
                name: cat.categoryName
              }))
            ].map((cat) => (
              <button
                key={cat.name}
                className={`category-pill ${activeCategory === cat.name ? 'selected' : ''}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}

          </div>
        </section>

        <section className="products-section container">
          <div className="section-heading product-heading"><div><span className="eyebrow">PRE-LOVED, STILL GREAT</span><h2>{search ? 'Search results' : activeCategory === 'All items' ? 'Fresh on campus' : activeCategory}<span className="heading-period">.</span></h2></div><span className="result-count">{filteredProducts.length} finds</span></div>
          {filteredProducts.length === 0 ? <div className="empty-state"><i className="bi bi-search" /><h3>No items found</h3><p>Try another search or choose a different category.</p><button className="btn btn-outline-dark" onClick={() => { setSearch(''); setActiveCategory('All items'); }}>Clear filters</button></div> :
            <div className="row g-4">
              {filteredProducts.map((p) => <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
                <article className="product-card">
                  <div className={`product-image ${p.color}`}><img
  src={p.image || "https://placehold.co/600x400/F0F3E9/244436?text=StudentSwap"}
  alt={p.title}
  loading="lazy"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      "https://placehold.co/600x400/F0F3E9/244436?text=StudentSwap";
  }}
/><span className="product-tag">{p.tag}</span><button className={`heart-button ${saved.includes(p.id) ? 'is-saved' : ''}`} onClick={() => toggleSaved(p.id)} aria-label={saved.includes(p.id) ? 'Remove from saved items' : 'Save item'}><i className={`bi ${saved.includes(p.id) ? 'bi-heart-fill' : 'bi-heart'}`} /></button></div>
                  <div className="product-info"><div className="product-category">{p.category} <span>·</span> {p.condition}</div><h3>{p.title}</h3><div className="price-line"><span className="product-price">{money(p.price)}</span></div><div className="product-footer"><span><i className="bi bi-person-circle me-1" />{p.seller}</span><button onClick={() => setSelectedProduct(p)} className="view-link">View item <i className="bi bi-arrow-up-right" /></button></div></div>
                
{(adminAuth || (session?.user?.id && session.user.id === p.ownerId)) && <div className="listing-actions">
  <button type="button" onClick={() => handleEditListing(p)}>Edit</button>
  <button type="button" onClick={() => handleDeleteListing(p)}>Delete</button>
</div>}
</article>
              </div>)}
            </div>}
        </section>

        <section className="semester-section" id="semester-sale"><div className="container semester-inner"><div className="semester-icon"><i className="bi bi-box-seam" /></div><div className="semester-copy"><span className="eyebrow">A LITTLE LESS CLUTTER, A LITTLE MORE CASH</span><h2>Leaving campus?<br /><em>Leave a good deal behind.</em></h2><p>List the things you no longer need. Help a junior get started without paying full price.</p><button className="btn btn-dark" onClick={() => session ? setShowSellNotice(true) : setShowStudentAuth(true)}>List something for sale <i className="bi bi-arrow-up-right ms-2" /></button></div><div className="semester-art"><div className="sale-circle">SEMESTER<br /><strong>END SALE</strong><span>PASS IT ON ↗</span></div><div className="doodle-book"><i className="bi bi-book" /></div><div className="doodle-cap"><i className="bi bi-mortarboard" /></div></div></div></section>

        <section className="how-section container" id="how-it-works"><div className="section-heading"><div><span className="eyebrow">NO COMPLICATED STUFF</span><h2>Swap in three steps<span className="heading-period">.</span></h2></div></div><div className="row g-4"><div className="col-md-4"><div className="step-card"><span className="step-number">01</span><i className="bi bi-search step-icon" /><h3>Find your find</h3><p>Search for the books, tools and essentials you need for your next semester.</p></div></div><div className="col-md-4"><div className="step-card"><span className="step-number">02</span><i className="bi bi-chat-dots step-icon" /><h3>Connect on campus</h3><p>Check the item details and arrange a convenient public campus handover.</p></div></div><div className="col-md-4"><div className="step-card"><span className="step-number">03</span><i className="bi bi-arrow-left-right step-icon" /><h3>Pass it forward</h3><p>Save money, give useful items another life and help another student out.</p></div></div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-inner"><Brand /><span>Good things deserve another semester. © 2026 StudentSwap</span><div className="d-flex gap-2 flex-wrap"><button type="button" className="btn btn-outline-dark btn-sm" onClick={() => setShowContactForm(true)}>Contact Admin</button>{adminAuth ? <><button type="button" className="btn btn-outline-dark btn-sm" onClick={loadAdminRequests}>Admin Requests</button><button type="button" className="btn btn-outline-dark btn-sm" onClick={() => { setAdminAuth(''); setContactRequests([]); setShowAdminRequests(false); }}>Logout Admin</button></> : <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => setShowAdminLogin(true)}>Admin Login</button>}{session && <button type="button" className="btn btn-outline-danger btn-sm" onClick={deleteMyAccount}>Delete my account</button>}<a href="#explore">Back to top ↑</a></div></div></footer>

{showSellNotice && (
  <div
    className="modal-backdrop-custom"
    onClick={() => setShowSellNotice(false)}
  >
    <div
      className="notice-modal sell-form-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sell-form-title"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="modal-close"
        onClick={() => setShowSellNotice(false)}
        aria-label="Close"
      >
        ×
      </button>

      <span className="eyebrow">STUDENT MARKETPLACE</span>
      <h2 id="sell-form-title">Sell an item</h2>
      <p>Enter your item's details to prepare a new listing.</p>

      <form
        onSubmit={async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const values = new FormData(form);

  try {
    let imageUrl = "";
    const imageFile = values.get("image");

    // Upload the selected image first, then save its URL with the listing.
    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith("image/")) {
        throw new Error("Please choose an image file.");
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        throw new Error("Image must be 5 MB or smaller.");
      }

      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      const uploadResponse = await fetch("http://localhost:8080/api/upload-image", {
        method: "POST",
        headers: apiHeaders(false),
        body: uploadData
      });
      const uploadResult = await uploadResponse.json().catch(() => null);
      if (!uploadResponse.ok) {
        throw new Error(uploadResult?.error || "Could not upload the image.");
      }
      imageUrl = uploadResult.imageUrl;
    }

    const listing = {
      title: values.get("title").trim(),
      description: values.get("description").trim(),
      price: Number(values.get("price")),
      conditionStatus: values.get("conditionStatus"),
      categoryId: Number(values.get("categoryId")),
      sellerId: 1,
      listingStatus: "AVAILABLE",
      imageUrl
    };

    const response = await fetch("http://localhost:8080/api/listings", {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify(listing)
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.error || "Could not save the listing.");
    }

    alert("Listing saved successfully!");
    form.reset();
    setShowSellNotice(false);
    window.location.reload();
  } catch (error) {
    alert("Could not save listing: " + error.message);
  }
}}
      >
        <label className="form-label">Item title</label>
        <input
          className="form-control mb-3"
          name="title"
          placeholder="e.g. Engineering Mathematics Book"
          required
        />

        <label className="form-label">Description</label>
        <textarea
          className="form-control mb-3"
          name="description"
          placeholder="Describe the item and its condition"
          rows="3"
          required
        />

        <label className="form-label">Price (₹)</label>
        <input
          className="form-control mb-3"
          name="price"
          type="number"
          min="1"
          step="0.01"
          placeholder="e.g. 250"
          required
        />

        <label className="form-label">Item image (optional, max 5 MB)</label>
        <input
          className="form-control mb-3"
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp,image/gif"
        />
        <small className="text-muted d-block mb-3">Choose a clear photo of the item. JPG, PNG, WEBP or GIF.</small>

        <label className="form-label">Condition</label>
        <select className="form-select mb-3" name="conditionStatus" required>
          <option value="">Select condition</option>
          <option value="LIKE_NEW">Like new</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
        </select>

        <label className="form-label">Category ID</label>
        <select className="form-select mb-4" name="categoryId" required>
          <option value="">Select category</option>
          {categories
            .filter((category) => category.categoryId != null)
            .map((category) => (
              <option
                key={category.categoryId}
                value={category.categoryId}
              >
                {category.categoryName}
              </option>
            ))}
        </select>

        <button className="btn btn-dark w-100" type="submit">
          Prepare listing
        </button>
      </form>
    </div>
  </div>
)}

{showContactForm && (
  <div className="modal-backdrop-custom" onClick={() => setShowContactForm(false)}>
    <div className="notice-modal sell-form-modal" role="dialog" aria-modal="true" aria-labelledby="contact-admin-title" onClick={(e) => e.stopPropagation()}>
      <button type="button" className="modal-close" onClick={() => setShowContactForm(false)} aria-label="Close">×</button>
      <span className="eyebrow">WE'RE HERE TO HELP</span><h2 id="contact-admin-title">Contact Admin</h2>
      <p>Request a correction or removal of a marketplace listing.</p>
      <form onSubmit={async (e) => {
        e.preventDefault(); if (contactSubmitting) return;
        const form = e.currentTarget; const values = new FormData(form);
        const requestData = { requesterName: String(values.get('requesterName') || '').trim(), requesterEmail: String(values.get('requesterEmail') || '').trim(), listingId: values.get('listingId') ? Number(values.get('listingId')) : null, message: String(values.get('message') || '').trim() };
        setContactSubmitting(true);
        try { const response = await fetch('http://localhost:8080/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestData) }); const result = await response.json().catch(() => null); if (!response.ok) throw new Error(result?.error || 'Could not submit your request.'); alert('Your request has been sent to the admin!'); form.reset(); setShowContactForm(false); }
        catch (error) { alert('Request failed: ' + error.message); } finally { setContactSubmitting(false); }
      }}>
        <label className="form-label">Your name</label><input className="form-control mb-3" name="requesterName" maxLength="100" required />
        <label className="form-label">Your email</label><input className="form-control mb-3" name="requesterEmail" type="email" maxLength="254" required />
        <label className="form-label">Listing ID (optional)</label><input className="form-control mb-3" name="listingId" type="number" min="1" />
        <label className="form-label">Message</label><textarea className="form-control mb-4" name="message" rows="4" maxLength="1000" placeholder="Explain your request..." required />
        <button className="btn btn-dark w-100" type="submit" disabled={contactSubmitting}>{contactSubmitting ? 'Sending...' : 'Send request'}</button>
      </form>
    </div>
  </div>
)}

{showAdminLogin && (
  <div className="modal-backdrop-custom" onClick={() => { setShowAdminLogin(false); setAdminError(''); }}>
    <div className="notice-modal sell-form-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title" onClick={(e) => e.stopPropagation()}>
      <button type="button" className="modal-close" onClick={() => { setShowAdminLogin(false); setAdminError(''); }} aria-label="Close">×</button>
      <span className="eyebrow">RESTRICTED ACCESS</span><h2 id="admin-login-title">Admin Login</h2><p>Use the admin credentials configured in your backend's application.properties file.</p>
      <form onSubmit={handleAdminLogin}>
        <label className="form-label">Username</label><input className="form-control mb-3" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} autoComplete="username" required />
        <label className="form-label">Password</label><input className="form-control mb-3" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} autoComplete="current-password" required />
        {adminError && <p role="alert" className="text-danger">{adminError}</p>}
        <button className="btn btn-dark w-100" type="submit">Log in</button>
      </form>
    </div>
  </div>
)}

{showAdminRequests && (
  <div className="modal-backdrop-custom" onClick={() => setShowAdminRequests(false)}>
    <div className="notice-modal sell-form-modal" role="dialog" aria-modal="true" aria-labelledby="admin-requests-title" onClick={(e) => e.stopPropagation()}>
      <button type="button" className="modal-close" onClick={() => setShowAdminRequests(false)} aria-label="Close">×</button>
      <span className="eyebrow">ADMIN PANEL</span><h2 id="admin-requests-title">Pending requests</h2>
      {contactRequests.length === 0 ? <p>No pending contact requests.</p> : contactRequests.map((request) => <div key={request.requestId} className="border rounded p-3 mb-3">
        <strong>Request #{request.requestId}{request.listingId ? ` · Listing #${request.listingId}` : ''}</strong><p className="mb-1">{request.requesterName} · {request.requesterEmail}</p><p className="mb-1">{request.message}</p><small>{request.createdAt ? new Date(request.createdAt).toLocaleString() : 'Date unavailable'} · {request.status}</small>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm mt-3"
          onClick={() => deleteContactRequest(request.requestId)}
        >
          Delete request
        </button>
      </div>)}
      <button className="btn btn-dark w-100 mt-2" onClick={loadAdminRequests}>Refresh requests</button>
    </div>
  </div>
)}


{showStudentAuth && <div className="modal-backdrop-custom" onClick={() => setShowStudentAuth(false)}><div className="notice-modal sell-form-modal" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true"><button className="modal-close" onClick={()=>setShowStudentAuth(false)}>×</button><span className="eyebrow">STUDENT ACCOUNT</span><h2>{registerMode?'Create account':'Student login'}</h2><form onSubmit={submitStudentAuth}>{registerMode && <><label className="form-label">Full name</label><input className="form-control mb-3" name="name" required minLength={2} maxLength={100}/></>}<label className="form-label">Email</label><input className="form-control mb-3" name="email" type="email" required autoComplete="email"/><label className="form-label">Password (minimum 8 characters)</label><input className="form-control mb-3" name="password" type="password" minLength={8} required autoComplete={registerMode?'new-password':'current-password'}/>{authError && <p className="text-danger">{authError}</p>}<button className="btn btn-dark w-100" type="submit">{registerMode?'Sign up':'Log in'}</button></form><button className="btn btn-link mt-2" onClick={()=>{setRegisterMode(!registerMode);setAuthError('');}}>{registerMode?'Already registered? Log in':'New student? Create account'}</button></div></div>}
{showInbox && <div className="modal-backdrop-custom" onClick={()=>setShowInbox(false)}><div className="notice-modal sell-form-modal" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true"><button className="modal-close" onClick={()=>setShowInbox(false)}>×</button><h2>Messages from buyers</h2>{inbox.length===0?<p>No messages yet.</p>:inbox.map(m=><div key={m.id} className="border rounded p-3 mb-2"><strong>{m.listingTitle}</strong><p>{m.message}</p><small>From: {m.buyerName} ({m.buyerEmail})</small></div>)}</div></div>}
{showMessage && selectedProduct && <div className="modal-backdrop-custom" onClick={()=>setShowMessage(false)}><div className="notice-modal sell-form-modal" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true"><button className="modal-close" onClick={()=>setShowMessage(false)}>×</button><h2>Message {selectedProduct.seller}</h2><p>About: {selectedProduct.title}</p><form onSubmit={async e=>{e.preventDefault();const message=new FormData(e.currentTarget).get('message');try{const response=await fetch('http://localhost:8080/api/messages',{method:'POST',headers:apiHeaders(),body:JSON.stringify({listingId:selectedProduct.id,message})});const data=await response.json();if(!response.ok)throw new Error(data.error||'Could not send');alert('Message sent!');setShowMessage(false);setSelectedProduct(null);}catch(err){alert(err.message);}}}><textarea className="form-control mb-3" name="message" rows={4} maxLength={1000} required placeholder="Is this item still available?"/><button className="btn btn-dark w-100">Send message</button></form></div></div>}
      {selectedProduct && <div className="modal-backdrop-custom" role="presentation" onClick={() => setSelectedProduct(null)}><div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-title" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close"><i className="bi bi-x-lg" /></button><img src={selectedProduct.image} alt={selectedProduct.title} /><div className="product-modal-body"><span className="eyebrow">{selectedProduct.category} · {selectedProduct.condition}</span><h2 id="product-title">{selectedProduct.title}</h2><div className="modal-price">{money(selectedProduct.price)} <span>{money(selectedProduct.oldPrice)} new-price reference</span></div><p>Contact the seller to arrange a safe public campus handover.</p><div className="seller-detail"><i className="bi bi-person-circle" /><span><strong>{selectedProduct.seller}</strong><small>{selectedProduct.college} · Campus pickup to be arranged</small></span></div>{selectedProduct.ownerId && session?.user?.id !== selectedProduct.ownerId && <button className="btn btn-dark w-100 mt-3" onClick={() => session ? setShowMessage(true) : setShowStudentAuth(true)}>Message seller</button>}<button className="btn btn-outline-dark w-100 mt-2" onClick={() => setSelectedProduct(null)}>Close item details</button></div></div></div>}
    </div>
  );
}

export default App;