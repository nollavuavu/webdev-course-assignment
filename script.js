const catalog = document.querySelector('#course-catalog');
const sectionByLevel = {
    beginner: catalog.querySelector('[data-level="beginner"]'),
    intermediate: catalog.querySelector('[data-level="intermediate"]'),
    advanced: catalog.querySelector('[data-level="advanced"]')
};

function createCourseLink(course) {
    const entry = document.createElement('div');
    const link = document.createElement('a');
    const title = document.createElement('strong');
    const details = document.createElement('span');

    link.href = course.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    title.textContent = course.title;
    link.appendChild(title);

    details.textContent = ` · ${course.duration} · ${course.provider}`;
    entry.className = 'course-entry';
    entry.append(link, details);
    addTooltip(title, course.description);

    return entry;
}

function addTooltip(title, description) {
    const tooltip = document.createElement('span');
    tooltip.className = 'course-tooltip';
    tooltip.textContent = description;
    document.body.appendChild(tooltip);

    title.addEventListener('mouseenter', () => {
        const titleBounds = title.getBoundingClientRect();
        tooltip.style.left = `${Math.max(8, titleBounds.left)}px`;
        tooltip.style.top = `${titleBounds.bottom + 8}px`;
        tooltip.classList.add('is-visible');
    });

    title.addEventListener('mouseleave', () => {
        tooltip.classList.remove('is-visible');
    });
}

async function loadCourses() {
    const response = await fetch('courses.json');
    if (!response.ok) {
        throw new Error(`Unable to load courses: ${response.status}`);
    }

    const courses = await response.json();
    courses.sort((first, second) => first.title.localeCompare(second.title));
    courses.forEach((course) => {
        const section = sectionByLevel[course.level];
        if (!section) return;

        const categoryGroup = [...section.querySelectorAll('.category-group')]
            .find((group) => group.dataset.category === course.category);
        const courseGrid = categoryGroup?.querySelector('.course-grid');
        if (courseGrid) {
            courseGrid.appendChild(createCourseLink(course));
        }
    });

    catalog.querySelectorAll('.category-group').forEach((group) => {
        group.hidden = group.querySelector('.course-grid').children.length === 0;
    });
}

loadCourses().catch((error) => {
    catalog.textContent = 'Courses could not be loaded. Please refresh and try again.';
    console.error(error);
});
