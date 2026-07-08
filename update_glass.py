import sys

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = '    <section class="section" style="background: var(--bg-alt);">'
end_marker = '    </section>\n'

start_idx = text.find(start_marker)
# Find the next section to know where to stop correctly
next_section = text.find('    <!-- =============================================\n         EDITORIAL LEGACY', start_idx)

if start_idx != -1 and next_section != -1:
    before = text[:start_idx]
    after = text[next_section:]
    
    new_content = '''    <!-- =============================================
         PREMIUM GLASSMORPHISM FEATURES
         ============================================= -->
    <section class="section glass-section-dark">
      <div class="container">
        
        <!-- Animated Gradient Title -->
        <h2 class="animated-gradient-text" style="text-align: center;">THE BEST WAY TO SAVE</h2>
        <p style="text-align: center; color: rgba(255,255,255,0.7); max-width: 600px; margin: 0 auto var(--space-2xl); font-size: 1.1rem; line-height: 1.6;">
          Plan your future with confidence through expert-backed chit schemes. We combine decades of experience with modern technology to deliver secure wealth creation.
        </p>
        
        <div class="glass-bento-grid">
          
          <!-- Financial Planning -->
          <div class="glass-card fade-up">
            <div class="glass-icon-wrapper">
              <img src="https://srimangalamchitfundsmadurai.com/images/financial-planning.png" alt="Financial Planning">
            </div>
            <h3>Financial Planning</h3>
            <p>Plan your finances seamlessly to meet every contingent expense without pressure and navigate life's milestones with ease.</p>
          </div>
          
          <!-- Borrow Fast -->
          <div class="glass-card fade-up delay-1">
            <div class="glass-icon-wrapper">
              <img src="https://srimangalamchitfundsmadurai.com/images/Borrow.png" alt="Borrow">
            </div>
            <h3>Borrow Fast</h3>
            <p>Need funds urgently? Our transparent auction system ensures immediate financial access when you need it most.</p>
          </div>
          
          <!-- Reap Big -->
          <div class="glass-card fade-up delay-2">
            <div class="glass-icon-wrapper">
              <img src="https://srimangalamchitfundsmadurai.com/images/Reap.png" alt="Reap">
            </div>
            <h3>Reap Big</h3>
            <p>Save consistently and reap maximum benefits at the end of your cycle with our high-yield structured plans.</p>
          </div>
          
        </div>
      </div>
    </section>

'''
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(before + new_content + after)
    print("Success")
else:
    print("Markers not found", start_idx, next_section)
