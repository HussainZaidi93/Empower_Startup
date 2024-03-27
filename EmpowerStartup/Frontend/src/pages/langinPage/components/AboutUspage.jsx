import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  aboutImg1,
  aboutImg2,
  aboutImg3,
  aboutImg4,
  aboutImg5,
  aboutImg6,
  aboutImg7,
  aboutImg8,
  aboutImg9,
  workIcon1,
  workIcon2,
  workIcon3,
} from '../images';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from '../Footer';

function AboutUspage(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div>
      <Box sx={{ backgroundColor: '#0685BB', marginTop: '1rem', height: '400px' }} textAlign="center">
        <Typography variant="h3" sx={{ color: 'white', paddingTop: '10rem' }}>
          Fuel the fire for change fueled by our passions.
        </Typography>
      </Box>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <img
              src={aboutImg1}
              alt="donate"
              style={{
                height: '300px',
                width: '400px',
                marginTop: '10px',
              }}
            />

            <img
              src={aboutImg2}
              alt="donate"
              style={{
                height: '300px',
                width: '400px',
                marginTop: '40px',
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <img
            src={aboutImg3}
            alt="donate"
            style={{
              height: '633px',
              width: '400px',
              marginTop: '10px',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <img
              src={aboutImg4}
              alt="donate"
              style={{
                height: '300px',
                width: '400px',
                marginTop: '10px',
              }}
            />

            <img
              src={aboutImg5}
              alt="donate"
              style={{
                height: '300px',
                width: '400px',
                marginTop: '40px',
              }}
            />
          </Box>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="center" marginTop="7rem">
        <Typography variant="h3">
          The <span style={{ color: '#44A3CC' }}>benefits</span> of working with us
        </Typography>
      </Box>
      <Grid container spacing={2} justifyContent="space-around" marginTop="4rem">
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <Card
            sx={{
              position: 'relative',
              border: '1px solid #ccc',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              backgroundColor: '#F4F6FC',
            }}
          >
            <img
              src={workIcon1}
              alt=""
              style={{
                height: '50px',
                width: '50px',
                padding: '10px',
              }}
            />
            <CardContent>
              <Typography variant="h6">Holistic Support Ecosystem</Typography>
              <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
                Our holistic support ecosystem nurtures startups at every stage, providing comprehensive guidance for
                sustainable growth
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={3} lg={3}>
          <Card
            sx={{
              position: 'relative',
              border: '1px solid #ccc',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              height: '100%',
              backgroundColor: '#F4F6FC',
            }}
          >
            <img
              src={workIcon2}
              alt=""
              style={{
                height: '50px',
                width: '50px',
                padding: '10px',
              }}
            />
            <CardContent>
              <Typography variant="h6">Quality Supplier Network</Typography>
              <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
                Our quality supplier network ensures startups access top-notch resources for their journey towards
                excellence.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <Card
            sx={{
              position: 'relative',
              border: '1px solid #ccc',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              height: '100%',
              backgroundColor: '#F4F6FC',
            }}
          >
            <img
              src={workIcon3}
              alt=""
              style={{
                height: '50px',
                width: '50px',
                padding: '10px',
              }}
            />
            <CardContent>
              <Typography variant="h6">Strategic Donor Engagement</Typography>
              <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
                Through strategic donor engagement, we foster impactful collaborations to fuel startup innovation and
                growth.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <div style={{ marginLeft: '8rem', marginRight: '5rem' }}>
        <Box display="flex" justifyContent="space-between" sx={{ marginTop: '10rem' }}>
          <div>
            <Typography variant="h3">Empowering Startups</Typography>
            <Typography variant="subtitle1" sx={{ marginTop: '10px', width: '80%' }}>
              We are dedicated NGO comitted to empowering startup ventures.Our process begins with users requesting
              assistance , and we work alongside them every step of the way.
            </Typography>
          </div>
          <div>
            <img
              src={aboutImg6}
              alt="donate"
              style={{
                height: '80%',
                width: '90%',
              }}
            />
          </div>
        </Box>

        <Box display="flex" justifyContent="space-between" sx={{ marginTop: '8rem' }}>
          <div>
            <img
              src={aboutImg7}
              alt="donate"
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </div>
          <div style={{ marginLeft: '250px' }}>
            <Typography variant="h3">Seamless Coordination</Typography>
            <Typography variant="subtitle1" sx={{ marginTop: '10px', width: '80%' }}>
              Our streamlined approach involves the admin accepting and facilitating user requests. We facilitate
              connections between users and supplier, ensuring a smooth process of obtainingnecessary products.
            </Typography>
          </div>
        </Box>
        <Box display="flex" justifyContent="space-between" sx={{ marginTop: '10rem' }}>
          <div>
            <Typography variant="h3">Rigorous Auditing</Typography>
            <Typography variant="subtitle1" sx={{ marginTop: '10px', width: '80%' }}>
              Our Auditors rigoroulsy verify the user's shop and requirements , insuring credibility and reliability.
              Admin continously works on refining the the audit process for an improved and trustworthy experience.
            </Typography>
          </div>
          <div>
            <img
              src={aboutImg8}
              alt="donate"
              style={{
                height: '80%',
                width: '90%',
              }}
            />
          </div>
        </Box>
        <Box display="flex" justifyContent="space-between" sx={{ marginTop: '8rem' }}>
          <div>
            <img
              src={aboutImg9}
              alt="donate"
              style={{
                height: '90%',
                width: '100%',
              }}
            />
          </div>
          <div style={{ marginLeft: '250px' }}>
            <Typography variant="h3">Enabling Investment</Typography>
            <Typography variant="subtitle1" sx={{ marginTop: '10px', width: '80%' }}>
              Beyond assistance, we provide a platform for donors passionate about investing in user business. Donors
              can contriute funds to support these startups , fostering growth and innovation.
            </Typography>
          </div>
        </Box>

        <Box display="flex" justifyContent="space-around" marginTop="3rem">
          <div style={{ width: '30%', marginTop:'4rem' }}>
            <Typography variant="h3">Frequently Asked Questions</Typography>
          </div>
          <div style={{ width: '60%' }}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                <Typography sx={{ width: '100%', flexShrink: 0 }} variant="h6">
                  How long does the application process take from submission to approval/disapproval?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  The duration of the application process varies depending on various factors such as the completeness
                  of the application, volume of applications received, and the complexity of the evaluation process.
                  Generally, we strive to review applications within 1 day, ensuring thorough consideration while
                  expediting the process to support our startup users efficiently.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
                <Typography sx={{ width: '100%', flexShrink: 0 }} variant="h6">
                  What criteria does the admin consider when approving or disapproving applications?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  The admin evaluates applications based on several factors including but not limited to the viability
                  and innovativeness of the business idea, potential impact on the market, scalability, sustainability,
                  and alignment with our program's objectives. Our aim is to support startups that demonstrate strong
                  potential for growth and positive societal impact.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3bh-content" id="panel3bh-header">
                <Typography sx={{ width: '100%', flexShrink: 0 }} variant="h6">
                  How does the supply chain work for startup users?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Our platform facilitates connections between startup users and reliable suppliers who offer quality
                  products essential for their business operations. Through our network of trusted suppliers, startup
                  users gain access to a diverse range of products required for their ventures, ensuring seamless
                  procurement processes and fostering mutually beneficial partnerships
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
                <Typography sx={{ width: '100%', flexShrink: 0 }} variant="h6">
                  What role does the auditor play in the startup empowerment process?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  The auditor plays a crucial role in ensuring transparency and accountability within our ecosystem.
                  They conduct comprehensive assessments of startup operations, financial records, and compliance with
                  regulatory standards. By providing independent verification and insights, auditors help startups build
                  trust with stakeholders, enhance governance practices, and foster long-term sustainability.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
                <Typography sx={{ width: '100%', flexShrink: 0 }} variant="h6">
                  How can donors contribute to supporting startup ventures?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Donors play a pivotal role in fueling innovation and driving positive change by providing financial
                  support to aspiring entrepreneurs. Donors have the flexibility to contribute through various channels
                  such as monetary donations, mentorship programs, or in-kind support, enabling them to align their
                  philanthropic goals with empowering the next generation of entrepreneurs.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </Box>
      </div>
      <Footer/>
    </div>
  );
}

export default AboutUspage;
